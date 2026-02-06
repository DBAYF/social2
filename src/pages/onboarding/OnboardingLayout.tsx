import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: 'step-1', label: 'Basic Info' },
  { path: 'step-2', label: 'Venture Details' },
  { path: 'step-3', label: 'Focus Areas' },
  { path: 'step-4', label: 'Goals' },
];

export function OnboardingLayout() {
  const location = useLocation();
  const currentStep = steps.findIndex(s => location.pathname.includes(s.path));

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Welcome to ReMake</h1>
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={step.path}
                className={`flex-1 h-2 rounded ${
                  index <= currentStep ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
