"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AddPageTransactions from "@/components/Pages/AddPage";

const drawWidth = 220;
function AddPage(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        uid,
      };

      try {
        const response = await api.get(
          "/api/banner/b0922bbeca57785f0add2136bca4786594e739cd",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (uid) {
      getTnx();
    }
  }, [uid, dispatch]);

  return (
    <Layout>
      <AddPageTransactions />
    </Layout>
  );
}
export default withAuth(AddPage);
