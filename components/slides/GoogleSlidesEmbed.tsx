"use client";

interface Props {
  embedUrl: string;
  presenterName: string;
}

export function GoogleSlidesEmbed({ embedUrl, presenterName }: Props) {
  return (
    <div className="w-full h-full bg-[#0A0C14] relative">
      <iframe
        src={embedUrl}
        title={`${presenterName} Presentation`}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay"
      />
    </div>
  );
}
