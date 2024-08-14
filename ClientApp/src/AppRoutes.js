import { Counter } from "./components/Counter";
import { SignIn } from "./components/SignIn";
import { Home } from "./components/Home";
import { Profile} from "./components/Profile";
import { CallBack } from "./components/CallBack";

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
    path: '/signin',
    element: <SignIn />
  }
  ,
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/callback',
    element: <CallBack />
  }

];

export default AppRoutes;
