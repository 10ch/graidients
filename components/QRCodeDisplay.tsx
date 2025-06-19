"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  questionId: string;
  onClose: () => void;
}

export function QRCodeDisplay({ questionId, onClose }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const voteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vote/${questionId}`;

  useEffect(() => {
    // Generate high-quality QR code for projection
    QRCode.toDataURL(voteUrl, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 800,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      type: "image/png",
    })
      .then((url) => {
        setQrCode(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setLoading(false);
      });
  }, [voteUrl]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mb-6">
        {loading ? (
          <div className="w-[400px] h-[400px] bg-gray-100 animate-pulse rounded mx-auto" />
        ) : (
          <img
            src={qrCode}
            alt="QR Code for voting"
            className="w-[400px] h-[400px] mx-auto"
          />
        )}
      </div>
      
      <p className="text-gray-600 mb-2">Can't scan? Visit:</p>
      <p className="text-sm font-mono text-gray-700 mb-6 break-all">{voteUrl}</p>
      
      <button
        onClick={onClose}
        className="btn-primary"
      >
        Close Vote
      </button>
    </div>
  );
}