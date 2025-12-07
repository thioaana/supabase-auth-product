"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void;
  disabled?: boolean;
}

export function SignaturePad({ onSignatureChange, disabled = false }: SignaturePadProps) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setIsEmpty(true);
    onSignatureChange(null);
  };

  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png");
      setIsEmpty(false);
      onSignatureChange(dataUrl);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Signature (Optional)</Label>
      <div
        className={cn(
          "relative rounded-md border border-input bg-background overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ height: "200px" }}
      >
        <SignatureCanvas
          ref={sigCanvasRef}
          canvasProps={{
            className: "touch-none",
            style: {
              width: "100%",
              height: "100%",
            },
          }}
          penColor="#333333"
          backgroundColor="rgb(255, 255, 255)"
          onEnd={handleEnd}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-muted-foreground text-sm">Sign here</span>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClear}
        disabled={disabled || isEmpty}
      >
        Clear Signature
      </Button>
    </div>
  );
}
