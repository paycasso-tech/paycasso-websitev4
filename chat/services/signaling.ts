
import { User } from '../types';

// WebRTC configuration with public STUN servers
const rtcConfig: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
};

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'active' | 'ended';

export interface IncomingCall {
    callId: string;
    callerId: string;
    callerName: string;
    callerAvatar: string;
    isVideo: boolean;
}

export interface CallState {
    callId: string | null;
    status: CallStatus;
    partnerId: string | null;
    partnerName: string | null;
    partnerAvatar: string | null;
    isVideo: boolean;
    isOutgoing: boolean;
}

type CallEventCallback = {
    onIncomingCall?: (call: IncomingCall) => void;
    onCallAccepted?: (callId: string) => void;
    onCallRejected?: (callId: string) => void;
    onCallEnded?: (callId: string, reason?: string) => void;
    onCallFailed?: (reason: string) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
};

class SignalingService {
    private ws: WebSocket | null = null;
    private userId: string | null = null;
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private currentCallId: string | null = null;
    private targetUserId: string | null = null;
    private callbacks: CallEventCallback = {};
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private connectionPromise: Promise<void> | null = null;

    connect(userId: string): Promise<void> {
        // If already connected, resolve immediately
        if (this.ws?.readyState === WebSocket.OPEN) {
            return Promise.resolve();
        }

        // If already connecting, return existing promise
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.userId = userId;

        this.connectionPromise = new Promise((resolve, reject) => {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // In development (port 5173), connect directly to the backend on port 3000
            // In production, use the same host (backend serves everything)
            const isDev = window.location.port === '5173';
            const wsHost = isDev ? `${window.location.hostname}:3000` : window.location.host;
            const wsUrl = `${wsProtocol}//${wsHost}/ws`;

            console.log('Connecting to signaling server:', wsUrl);

            // Close existing connection if any
            if (this.ws) {
                try {
                    this.ws.close();
                } catch (e) { }
            }

            this.ws = new WebSocket(wsUrl);

            const timeout = setTimeout(() => {
                this.connectionPromise = null;
                reject(new Error('Connection timeout'));
            }, 10000);

            this.ws.onopen = () => {
                clearTimeout(timeout);
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.connectionPromise = null;

                // Register this user
                this.send({ type: 'register', userId });
                resolve();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.connectionPromise = null;
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                clearTimeout(timeout);
                console.error('WebSocket error:', error);
                this.connectionPromise = null;
                reject(error);
            };
        });

        return this.connectionPromise;
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
            setTimeout(() => {
                if (this.userId) {
                    this.connect(this.userId).catch(console.error);
                }
            }, 2000 * this.reconnectAttempts);
        }
    }

    private send(message: object) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    }

    private async handleMessage(message: Record<string, unknown>) {
        console.log('Signaling message:', message.type);

        switch (message.type) {
            case 'registered':
                console.log('Registered with signaling server');
                break;

            case 'incoming-call':
                this.currentCallId = message.callId as string;
                this.targetUserId = message.callerId as string;
                this.callbacks.onIncomingCall?.({
                    callId: message.callId as string,
                    callerId: message.callerId as string,
                    callerName: message.callerName as string,
                    callerAvatar: message.callerAvatar as string,
                    isVideo: message.isVideo as boolean
                });
                break;

            case 'call-ringing':
                this.currentCallId = message.callId as string;
                break;

            case 'call-accepted':
                this.callbacks.onCallAccepted?.(message.callId as string);
                // Caller creates offer when call is accepted
                await this.createAndSendOffer();
                break;

            case 'call-rejected':
                this.cleanup();
                this.callbacks.onCallRejected?.(message.callId as string);
                break;

            case 'call-ended':
                this.cleanup();
                this.callbacks.onCallEnded?.(message.callId as string, message.reason as string | undefined);
                break;

            case 'call-failed':
                this.cleanup();
                this.callbacks.onCallFailed?.(message.reason as string);
                break;

            case 'webrtc-offer':
                await this.handleOffer(message.offer as RTCSessionDescriptionInit, message.fromUserId as string);
                break;

            case 'webrtc-answer':
                await this.handleAnswer(message.answer as RTCSessionDescriptionInit);
                break;

            case 'webrtc-ice-candidate':
                await this.handleIceCandidate(message.candidate as RTCIceCandidateInit);
                break;
        }
    }

    setCallbacks(callbacks: CallEventCallback) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    async initiateCall(targetUser: User, currentUser: User, isVideo: boolean): Promise<void> {
        this.targetUserId = targetUser.id;

        // Ensure we're connected
        if (this.ws?.readyState !== WebSocket.OPEN) {
            try {
                await this.connect(currentUser.id);
            } catch (err) {
                throw new Error('Not connected to signaling server');
            }
        }

        // Get local media first
        await this.setupLocalMedia(isVideo);

        // Send call initiation
        this.send({
            type: 'call-initiate',
            targetUserId: targetUser.id,
            callerId: currentUser.id,
            callerName: currentUser.fullName,
            callerAvatar: currentUser.avatar,
            isVideo
        });
    }

    async acceptCall(callId: string, isVideo: boolean): Promise<void> {
        // Get local media
        await this.setupLocalMedia(isVideo);

        // Send accept message
        this.send({
            type: 'call-accept',
            callId
        });
    }

    rejectCall(callId: string) {
        this.send({
            type: 'call-reject',
            callId
        });
        this.cleanup();
    }

    endCall() {
        if (this.currentCallId) {
            this.send({
                type: 'call-end',
                callId: this.currentCallId
            });
        }
        this.cleanup();
    }

    private async setupLocalMedia(isVideo: boolean): Promise<MediaStream> {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: isVideo ? { width: 640, height: 480 } : false
            });
            return this.localStream;
        } catch (err) {
            // Fallback to audio only
            if (isVideo) {
                console.warn('Camera not available, falling back to audio');
                this.localStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                return this.localStream;
            }
            throw err;
        }
    }

    private createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(rtcConfig);

        // Add local tracks to connection
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection!.addTrack(track, this.localStream!);
            });
        }

        // Handle incoming tracks
        this.peerConnection.ontrack = (event) => {
            console.log('Received remote track');
            this.remoteStream = event.streams[0];
            this.callbacks.onRemoteStream?.(this.remoteStream);
        };

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.targetUserId) {
                this.send({
                    type: 'webrtc-ice-candidate',
                    targetUserId: this.targetUserId,
                    callId: this.currentCallId,
                    candidate: event.candidate
                });
            }
        };

        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection?.connectionState);
            if (this.peerConnection) {
                this.callbacks.onConnectionStateChange?.(this.peerConnection.connectionState);
            }
        };
    }

    private async createAndSendOffer() {
        this.createPeerConnection();

        const offer = await this.peerConnection!.createOffer();
        await this.peerConnection!.setLocalDescription(offer);

        this.send({
            type: 'webrtc-offer',
            targetUserId: this.targetUserId,
            callId: this.currentCallId,
            offer
        });
    }

    private async handleOffer(offer: RTCSessionDescriptionInit, fromUserId: string) {
        this.targetUserId = fromUserId;
        this.createPeerConnection();

        await this.peerConnection!.setRemoteDescription(offer);

        const answer = await this.peerConnection!.createAnswer();
        await this.peerConnection!.setLocalDescription(answer);

        this.send({
            type: 'webrtc-answer',
            targetUserId: fromUserId,
            callId: this.currentCallId,
            answer
        });
    }

    private async handleAnswer(answer: RTCSessionDescriptionInit) {
        await this.peerConnection?.setRemoteDescription(answer);
    }

    private async handleIceCandidate(candidate: RTCIceCandidateInit) {
        try {
            await this.peerConnection?.addIceCandidate(candidate);
        } catch (err) {
            console.error('Error adding ICE candidate:', err);
        }
    }

    getLocalStream(): MediaStream | null {
        return this.localStream;
    }

    getRemoteStream(): MediaStream | null {
        return this.remoteStream;
    }

    toggleMute(muted: boolean) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !muted;
            });
        }
    }

    toggleVideo(enabled: boolean) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enabled;
            });
        }
    }

    private cleanup() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        this.remoteStream = null;
        this.currentCallId = null;
        this.targetUserId = null;
    }

    disconnect() {
        this.cleanup();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.userId = null;
    }
}

// Singleton instance
export const signalingService = new SignalingService();
