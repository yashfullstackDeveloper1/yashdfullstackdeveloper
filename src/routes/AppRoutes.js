import React, { useState } from "react";
import Login from "../pages/Login";
import Home from "../pages/Home";
import RoleA from "../pages/Role_a";
import RoleB from "../pages/Role_b";
import Instuteb from "../pages/Institute_b";
import Instutea from "../pages/Institute_a";
import DevaA from "../pages/Role_a_dashboard";
import DevaB from "../pages/Role_b_dashboard";
import InstituteOne from "../pages/inst_a_role_aa";
import InstituteTwo from "../pages/inst_a_role_bb";
import InstituteThree from "../pages/inst_a_role_cc";
import InstituteFour from "../pages/inst_a_role_dd";
import InstituteFive from "../pages/inst_a_role_ee";
import DashboardAOneSecond from "../pages/Dashboard_secondary_a_one";
import DashboardBOneSecond from "../pages/Dashboard_secondary_b_one";
import DashboardCOneSecond from "../pages/Dashboard_secondary_c_one";
import Mainrolea from "../pages/main_role_a";
import Mainroleb from "../pages/main_role_b";
import Mainrolec from "../pages/main_role_c";
import Maindashboarda from "../pages/main_dashboard_a";
import Maindashboardb from "../pages/main_dashboard_b";

function AppRoutes() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "home" && <Home setPage={setPage} />}
      {page === "rolea" && <RoleA setPage={setPage} />}
      {page === "roleb" && <RoleB setPage={setPage} />}
      {page === "instuteb" && <Instuteb setPage={setPage} />}
      {page === "instutea" && <Instutea setPage={setPage} />}
      {page === "DevaA" && <DevaA setPage={setPage} />}
      {page === "DevaB" && <DevaB setPage={setPage} />}
      {page === "instituteOne" && <InstituteOne setPage={setPage} />}
      {page === "instituteTwo" && <InstituteTwo setPage={setPage} />}
      {page === "InstituteThree" && <InstituteThree setPage={setPage} />}
      {page === "InstituteFour" && <InstituteFour setPage={setPage} />}
      {page === "InstituteFive" && <InstituteFive setPage={setPage} />}
      {page === "DashboardAOneSecond" && <DashboardAOneSecond setPage={setPage} />}
      {page === "DashboardBOneSecond" && <DashboardBOneSecond setPage={setPage} />}
      {page === "DashboardCOneSecond" && <DashboardCOneSecond setPage={setPage} />}
      {page === "Mainrolea" && <Mainrolea setPage={setPage} />}
      {page === "Mainroleb" && <Mainroleb setPage={setPage} />}
      {page === "Mainrolec" && <Mainrolec setPage={setPage} />}
      {page === "Maindashboarda" && <Maindashboarda setPage={setPage} />}
      {page === "Maindashboardb" && <Maindashboardb setPage={setPage} />}

    </>
  );
}

export default AppRoutes;
