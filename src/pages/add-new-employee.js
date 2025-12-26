"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import EmployeeTransactions from "@/components/Employee/add_employee";
import { useRouter } from "next/router";

const drawWidth = 220;
function AddEmployee(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const role = Cookies.get("employee_role");

  const { id, action } = router.query;

  useEffect(() => {
    const getMenus =
      localStorage.getItem("menu") !== "" &&
      localStorage.getItem("menu") != "undefined"
        ? JSON.parse(localStorage.getItem("menu"))
        : [];
    const page_url = "employee-list";
    let foundMenu = false;

    if (getMenus && role === "Admin") {
      for (const item of getMenus) {
        if (item.menu_url === page_url && item._insert == 1) {
          foundMenu = true;
          break;
        }
        if (action === "edit") {
          if (item.menu_url === page_url && item._update == 1) {
            foundMenu = true;
            break;
          } else {
            foundMenu = false;
          }
        }
      }
    }
    if (!foundMenu) {
      //window.location.href = '/dashboard';
    }
  }, [role, action]);

  return (
    <Layout>
      <EmployeeTransactions />
    </Layout>
  );
}
export default withAuth(AddEmployee);
