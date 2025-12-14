//src/App.jsx
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) dispatch(get_user_info());
  }, [token, dispatch]);

  const allRoutes = [...publicRoutes, getRoutes()];

  return <Router allRoutes={allRoutes} />;
}

export default App;
