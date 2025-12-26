"use client";
import React from "react";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import AddNotificationTransactions from "@/components/Notification/AddNotification";

const drawWidth = 220;
function AddNotification(props) {
  return (
    <Layout>
      <AddNotificationTransactions />
    </Layout>
  );
}
export default withAuth(AddNotification);
