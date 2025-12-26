"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AddProductTransactions from "@/components/Product/AddProduct";


const drawWidth = 220;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius: 2,
    // border: '2px solid #000',
    boxShadow: 24, overflow: 'auto'
};

const innerStyle = {
    overflow: 'auto',
    width: 400,
    height: 400,
};

function AddProducts(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    // useEffect(() => {
    //     const getTnx = async () => {
    //         const reqData = {
    //             uid
    //         }

    //         try {

    //             const response = await api.get("/api/product/add-new-product", reqData);
                
    //             if (response.status === 200) {
                    
    //                 setShowServiceTrans(response.data.data)
                  
    //             }

    //         } catch (error) {
    //             if (error?.response?.data?.error) {
    //                 dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
    //             } else {
    //                 dispatch(callAlert({ message: error.message, type: 'FAILED' }))
    //             }
    //         }
    //     }

    //     if (uid) {
    //         getTnx();
    //     }

    // }, [uid,dispatch])


    return (

        <Layout>
            <AddProductTransactions  />
        </Layout>


    );
}
export default withAuth(AddProducts);

