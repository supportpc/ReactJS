import React from 'react'



// css


/* share iocn */

// .spss ul li {
//     border-radius: 8px;
//     background-color: rgb(0, 106, 112);
//     height: 35px;
//     line-height: 35px;
//     text-align: center;
//     width: 35px;
//     transition: all 0.3s ease;
// }

// .spss ul li:hover {
//     background-color: rgb(62, 76, 102);
//     cursor: pointer;
// }

// .spss ul li a {
//     font-size: 14px;
//     color: #ffffff;
// }

// .spss.style2 ul li {
//     background-color: #ffffff;
// }

// .spss.style2 ul li a {
//     color: #484848;
// }

// .spss.style2 ul li:hover {
//     background: rgb(12 129 229);
// }

// .spss.style2 ul li:hover a {
//     color: #fff;
// }
const shareSocialLink = () => {

    const [currentURL, setCurrentURL] = useState("");
    const [showCopyToast, setShowCopyToast] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentURL(window.location.href);
        }
    }, []);

    const handleCopyLink = () => {
        if (navigator.clipboard && currentURL) {
            navigator.clipboard.writeText(currentURL).then(() => {
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 3000);
            });
        }
    }

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: product_user?.name || "",
                    text: "I just viewed this business listing and found it very useful.",
                    url: currentURL,
                });
            } catch (error) {
                // User cancelled or error occurred
                console.log('Sharing cancelled or failed:', error);
            }
        }
    }




    return (
        <>
            <div className="spss style2 mt20 text-end tal-400">
                <ul className="mb2">
                    <li className="list-inline-item bg-light  border">
                        <a href="#" onClick={handleCopyLink} title="Copy link" >
                            <i className="fa fa-link fa-lg text-dark"></i>
                        </a>
                    </li>
                    <li className="list-inline-item bg-light border">
                        <a href="#" onClick={handleNativeShare} title="Share" >
                            <i className="fa fa-share-alt fa-lg text-dark"></i>
                        </a>
                    </li>
                </ul>
            </div>

            {showCopyToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-success text-white">
                            <strong className="me-auto">Success!</strong>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowCopyToast(false)}></button>
                        </div>
                        <div className="toast-body">
                            Link copied to clipboard!
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default shareSocialLink
