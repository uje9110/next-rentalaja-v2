import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface RescheduleStepsProps {
  setRescheduleStep: Dispatch<SetStateAction<number>>;
  stepAmount: number;
  currentStep: number;
}

export const RescheduleSteps: FC<RescheduleStepsProps> = ({
  setRescheduleStep,
  stepAmount,
  currentStep,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === stepAmount;

  return (
    <div className="flex w-full items-center justify-between">
      {/* Previous Button */}
      <button
        disabled={isFirstStep}
        onClick={() => {
          if (!isFirstStep) setRescheduleStep(currentStep - 1);
        }}
        className={`flex items-center justify-start text-xs font-medium ${
          isFirstStep ? "cursor-not-allowed text-gray-400" : "text-black"
        }`}
      >
        <ChevronLeft size={14} />
        <span>Sebelumnya</span>
      </button>

      {/* Step Indicators */}
      <div className="flex w-fit gap-1">
        {Array.from({ length: stepAmount }).map((_, index) => {
          const isSameStep = index + 1 === currentStep;
          return (
            <div
              key={index}
              style={isSameStep ? { background: "black" } : {}}
              className="h-2 w-2 rounded-full bg-slate-400"
            />
          );
        })}
      </div>

      {/* Next Button */}
      <button
        disabled={isLastStep}
        onClick={() => {
          if (!isLastStep) setRescheduleStep(currentStep + 1);
        }}
        className={`flex items-center justify-start text-xs font-medium ${
          isLastStep ? "cursor-not-allowed text-gray-400" : "text-black"
        }`}
      >
        <span>Selanjutnya</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};
