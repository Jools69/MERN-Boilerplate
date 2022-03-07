import React, { useEffect } from 'react';
import reactDom from 'react-dom';
import './Modal.scss';

const Modal = (props) => {

    const { show, title, content, actions } = props;

    useEffect(() => {
        if (show) {
            const width = document.body.clientWidth;
            const hasVerticalScrollbar = (window.innerWidth > document.documentElement.clientWidth);
            document.body.style.overflowX = "hidden";
            document.body.style.overflowY = hasVerticalScrollbar ? "scroll" : "";
            document.body.style.width = `${width}px`;
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.position = "fixed";
        }
        else {
            const scrollY = document.body.style.top;
            document.body.style.overflowX = "";
            document.body.style.overflowY = "";
            document.body.style.width = "";
            document.body.style.position = "";
            document.body.style.top = "";
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [show]);

    // return show && reactDom.createPortal(
    return reactDom.createPortal(
        <div className={`modalContainer ${show ? 'show' : 'hide'}`}>
            <div className="modalBackdrop">
            </div>
            <div className="modalForeground">
                <div className="modalParent">
                    <div className="modalTitle">
                        {title}
                    </div>
                    <div className="modalBody">
                        {content}
                    </div>
                    <div className="modalFooter">
                        <div className="modalFooterContainer">
                            {actions}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('AppReactModal')
    );
}

export default Modal;