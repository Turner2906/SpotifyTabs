import { Counter } from "./components/Counter";
import { SignIn } from "./components/SignIn";
import { Home } from "./components/Home";
import { Profile} from "./components/Profile";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/SignIn',
    element: <SignIn />
  }
  ,
  {
    path: '/Profile',
    element: <Profile />
  }
];

export default AppRoutes;
