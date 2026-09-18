import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Loader from '../layout/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrder, returnOrder, myOrders, invoicePdf, getInvoice, clearErrors } from '../../redux/actions/orderActions'
import Dialog1 from "../Dialog1";
import Dialog2 from "../Dialog2";
import { CANCEL_ORDER_RESET, RETURN_ORDER_RESET } from '../../redux/constants/orderConstants'
import { cancelReason } from '../Dialog1'
import { returnReason } from '../Dialog2'
import { Buffer } from 'buffer'

const ListOrders = () => {
    const router = useRouter()
    const dispatch = useDispatch();

    return (
        <Fragment>


            <button
                type="button"
                className="action-btn view"
                onClick={() => dispatch(getInvoice(order.order_id))}
            >
                <i className="fas fa-eye"></i>
                Download Invoice
            </button>
        </Fragment>
    )
}

export default ListOrders