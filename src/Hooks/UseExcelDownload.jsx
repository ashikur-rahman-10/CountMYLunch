import useAxiosSecure from "./UseAxiosSecure";

/**
 * useExcelDownload
 *
 * Excel export endpoints require the Firebase auth token, so a plain
 * <a href="..."> link won't work (the browser navigation request
 * carries no Authorization header). This fetches the file as a blob
 * through the authenticated axios instance instead, then triggers the
 * browser's normal "Save As" flow via a temporary object URL.
 */
const useExcelDownload = () => {
    const axiosSecure = useAxiosSecure();

    const downloadExcel = async (url, filename) => {
        const response = await axiosSecure.get(url, {
            responseType: "blob",
        });

        const blobUrl = window.URL.createObjectURL(
            new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
    };

    return downloadExcel;
};

export default useExcelDownload;
