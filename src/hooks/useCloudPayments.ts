/** @format */

import { useEffect } from "react";

const useCloudPayments = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.cloudpayments.ru/bundles/cloudpayments.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
};

export default useCloudPayments;
