import axios from "axios";
export const getInvoice = (orderId) => async (dispatch) => {
    try {
        const response = await axios.get(
            `/api/orders/invoice/${orderId}`,
            {
                responseType: "blob"
            }
        );

        const blob = new Blob(
            [response.data],
            { type: "application/pdf" }
        );

        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 10000);

    } catch (error) {
        console.error(
            "GET INVOICE ERROR:",
            error.response?.data || error.message
        );

        throw error;
    }
};