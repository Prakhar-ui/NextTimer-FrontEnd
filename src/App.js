import React from "react";
import Home from "./Home";
import CreateTask from "./CreateTask";
import MyTasks from "./MyTasks";
import EditTask from "./EditTask";
import Signin from "./Signin";
import Signup from "./Signup";
import EditProfile from "./EditProfile";
import MyTaskTimer from "./MyTaskTimer";
import { Route, Routes } from "react-router-dom";

const NotFound = () => {
  return <div>404 Not Found</div>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-tasks" element={<MyTasks />} />
      <Route path="/create-task" element={<CreateTask />} />
      <Route path="/edit-task/:id" element={<EditTask />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/task-timer/:id" element={<MyTaskTimer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
