export default function BackgroundVideo() {
  return (
    <video
      className="
        absolute inset-0
        w-full h-full
        object-cover
        z-0
      "
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="our-flow/video/background.mp4" type="video/mp4" />
    </video>
  );
}
