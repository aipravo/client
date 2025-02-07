import { FC, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	pdfUrl: string;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, pdfUrl }) => {
	useEffect(() => {
		const closeOnEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [onClose]);

	if (!isOpen) return null;

	const getFileExtension = (url: string) => {
		return url.split('.').pop(); // Возвращает "pdf"
	};

	const fileType = getFileExtension(pdfUrl)
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button className="close-btn" onClick={onClose}>
					<span className="material-symbols-outlined">close</span>
				</button>
				{fileType === 'pdf' ? (
					<iframe src={pdfUrl} className="pdf-viewer" />
				) : fileType === 'doc' || fileType === 'docx' ?
					(
						<iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`} className="pdf-viewer" />
						// <DocViewer documents={[{ uri: pdfUrl }]} pluginRenderers={DocViewerRenderers} className="pdf-viewer" />
					) : null}

			</div>
		</div>
	);
};

export default Modal;
