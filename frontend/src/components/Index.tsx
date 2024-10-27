import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  // if (data.user.setup) {
  //   navigate("/setup");
  // } else {
  navigate("/dashboard");
  // }
  return null;
};

export default Index;
