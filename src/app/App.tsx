import { BrowserRouter } from 'react-router';
import AppRoutes from './routes/AppRoutes';
import PwaInstallPrompt from './features/shared/components/PwaInstallPrompt';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <PwaInstallPrompt />
    </BrowserRouter>
  );
}
