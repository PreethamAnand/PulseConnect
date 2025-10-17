
import { Navigate } from "react-router-dom";

// Redirecting to Dashboard as it's our main page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
