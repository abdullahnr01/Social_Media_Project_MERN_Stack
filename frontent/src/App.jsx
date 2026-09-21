// built in

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";

// local
import AllRouters from "./Routes/router";
import { UserContextProvider } from "./Context/context";
import SocketHandler from "./Components/Socket/socket_handler";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <UserContextProvider>
          <SocketHandler />
          <AllRouters />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
