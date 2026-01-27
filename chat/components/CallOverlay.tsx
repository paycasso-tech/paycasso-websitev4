
import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';
import { signalingService, CallStatus } from '../services/signaling';

interface CallOverlayProps {
  partner: User;
  currentUser: User;
  videoEnabled: boolean;
  onEndCall: () => void;
  isIncoming?: boolean;
  callId?: string;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
  partner,
  currentUser,
  videoEnabled: initialVideoEnabled,
  onEndCall,
  isIncoming = false,
  callId
}) => {
  const [status, setStatus] = useState<CallStatus>(isIncoming ? 'ringing' : 'calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(initialVideoEnabled);
  const [isCameraOff, setIsCameraOff] = useState(!initialVideoEnabled);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  const timerRef = useRef<number | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const handleEndCall = () => {
    if (status === 'ended') return;
    setStatus('ended');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    signalingService.endCall();
    setTimeout(onEndCall, 500);
  };

  // Initialize call
  useEffect(() => {
    // Set up signaling callbacks
    signalingService.setCallbacks({
      onCallAccepted: () => {
        console.log('Call accepted!');
        setStatus('connecting');
      },
      onCallRejected: () => {
        setErrorMsg('Call was declined');
        setStatus('ended');
        setTimeout(onEndCall, 2000);
      },
      onCallEnded: (_, reason) => {
        setErrorMsg(reason || 'Call ended');
        setStatus('ended');
        setTimeout(onEndCall, 1500);
      },
      onCallFailed: (reason) => {
        setErrorMsg(reason);
        setStatus('ended');
        setTimeout(onEndCall, 2000);
      },
      onRemoteStream: (stream) => {
        console.log('Got remote stream!');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setStatus('active');

        // Start call timer
        timerRef.current = window.setInterval(() => {
          setDuration(d => d + 1);
        }, 1000);
      },
      onConnectionStateChange: (state) => {
        console.log('Connection state changed:', state);
        if (state === 'connected') {
          setStatus('active');
        } else if (state === 'disconnected' || state === 'failed') {
          setErrorMsg('Connection lost');
          handleEndCall();
        }
      }
    });

    const initCall = async () => {
      try {
        if (isIncoming && callId) {
          // This is an incoming call - wait for user to accept
          // The accept button will trigger acceptCall
        } else {
          // This is an outgoing call - initiate it
          await signalingService.initiateCall(partner, currentUser, videoEnabled);
          setStatus('calling');
        }

        // Set up local video preview
        setTimeout(() => {
          const localStream = signalingService.getLocalStream();
          if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        }, 500);

      } catch (err: any) {
        console.error('Failed to start call:', err);
        setErrorMsg(`Call failed: ${err.message || 'Could not access microphone'}`);
        setTimeout(onEndCall, 3000);
      }
    };

    if (!isIncoming) {
      initCall();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleAcceptCall = async () => {
    if (!callId) return;

    try {
      setStatus('connecting');
      await signalingService.acceptCall(callId, videoEnabled);

      // Set up local video
      setTimeout(() => {
        const localStream = signalingService.getLocalStream();
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      }, 500);
    } catch (err: any) {
      setErrorMsg(`Failed to accept: ${err.message}`);
      setTimeout(onEndCall, 2000);
    }
  };

  const handleRejectCall = () => {
    if (callId) {
      signalingService.rejectCall(callId);
    }
    onEndCall();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    signalingService.toggleMute(newMuted);
  };

  const toggleCamera = () => {
    if (!videoEnabled) return;
    const newCameraOff = !isCameraOff;
    setIsCameraOff(newCameraOff);
    signalingService.toggleVideo(!newCameraOff);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (status) {
      case 'calling': return 'Calling...';
      case 'ringing': return 'Incoming Call';
      case 'connecting': return 'Connecting...';
      case 'active': return formatTime(duration);
      case 'ended': return 'Call Ended';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-between py-10 animate-in fade-in duration-300">

      {/* Remote Video (Partner) - Full background when video enabled and active */}
      {videoEnabled && status === 'active' && (
        <div className="absolute inset-0 bg-zinc-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>
      )}

      {/* Partner Info */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 relative z-10">
        <div className="relative">
          {/* Pulsing ring during calling/ringing/connecting */}
          {(status === 'calling' || status === 'ringing' || status === 'connecting') && (
            <>
              <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-ping"></div>
              <div className="absolute -inset-8 bg-blue-500/10 rounded-full animate-pulse"></div>
            </>
          )}
          {/* Active call indicator */}
          {status === 'active' && !videoEnabled && (
            <div className="absolute -inset-2 bg-green-500/30 rounded-full animate-pulse"></div>
          )}

          {/* Only show avatar when not in active video call */}
          {!(videoEnabled && status === 'active') && (
            <img
              src={partner.avatar}
              alt=""
              className="w-32 h-32 rounded-full border-4 border-zinc-700 object-cover relative z-10 shadow-2xl"
            />
          )}

          {/* Online indicator */}
          {status === 'active' && !videoEnabled && (
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-black z-20"></div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{partner.fullName}</h2>
          <p className={`text-sm tracking-widest uppercase font-semibold ${status === 'active' ? 'text-green-400' :
              status === 'ringing' ? 'text-blue-400' : 'text-zinc-400'
            }`}>
            {videoEnabled ? '📹 Video Call' : '📞 Voice Call'} • {getStatusText()}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-lg mt-4">
            <p className="text-amber-400 text-xs font-medium uppercase tracking-widest">{errorMsg}</p>
          </div>
        )}

        {/* Call quality indicator when active */}
        {status === 'active' && (
          <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full">
            <div className="flex gap-0.5">
              <div className={`w-1 h-2 rounded-full ${connectionQuality !== 'poor' ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
              <div className={`w-1 h-3 rounded-full ${connectionQuality !== 'poor' ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
              <div className={`w-1 h-4 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
              <div className={`w-1 h-3 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-400' : 'bg-zinc-600'}`}></div>
            </div>
            <span className="text-xs text-zinc-400 capitalize">{connectionQuality}</span>
          </div>
        )}
      </div>

      {/* Local Video Preview */}
      {videoEnabled && (
        <div className="absolute top-10 right-10 w-48 aspect-video rounded-xl border-2 border-zinc-700 bg-black overflow-hidden shadow-2xl z-20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}
          />
          {isCameraOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <i className="fa-solid fa-video-slash text-zinc-600 text-xl"></i>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
            You
          </div>
        </div>
      )}

      {/* Incoming Call Actions */}
      {isIncoming && status === 'ringing' && (
        <div className="flex items-center gap-8 z-10 mb-6">
          <button
            onClick={handleRejectCall}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/30"
            title="Decline"
          >
            <i className="fa-solid fa-phone-slash text-2xl"></i>
          </button>

          <button
            onClick={handleAcceptCall}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30 animate-bounce"
            title="Accept"
          >
            <i className="fa-solid fa-phone text-2xl"></i>
          </button>
        </div>
      )}

      {/* Active Call Controls */}
      {status !== 'ringing' && (
        <div className="flex items-center gap-4 z-10 bg-zinc-900/80 p-5 rounded-2xl backdrop-blur-md border border-zinc-800 shadow-2xl">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            disabled={status !== 'active'}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
              } ${isMuted
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-lg`}></i>
          </button>

          {/* Camera Toggle */}
          {videoEnabled && (
            <button
              onClick={toggleCamera}
              disabled={status !== 'active'}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
                } ${isCameraOff
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              <i className={`fa-solid ${isCameraOff ? 'fa-video-slash' : 'fa-video'} text-lg`}></i>
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/30"
            title="End Call"
          >
            <i className="fa-solid fa-phone-slash text-xl"></i>
          </button>

          {/* Speaker Button */}
          <button
            disabled={status !== 'active'}
            className={`w-14 h-14 bg-zinc-800 text-white hover:bg-zinc-700 rounded-full flex items-center justify-center transition-all ${status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            title="Speaker"
          >
            <i className="fa-solid fa-volume-high text-lg"></i>
          </button>

          {/* Screen Share */}
          {videoEnabled && (
            <button
              disabled={status !== 'active'}
              className={`w-14 h-14 bg-zinc-800 text-white hover:bg-zinc-700 rounded-full flex items-center justify-center transition-all ${status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Share Screen"
            >
              <i className="fa-solid fa-display text-lg"></i>
            </button>
          )}
        </div>
      )}

      {/* Bottom info text */}
      <p className="text-zinc-600 text-xs mt-4 z-10">
        {status === 'active'
          ? 'End-to-end encrypted • WebRTC'
          : status === 'ringing'
            ? 'Answer or decline the call'
            : 'Establishing peer connection...'
        }
      </p>
    </div>
  );
};

export default CallOverlay;
