import React, { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';

const RefreshPage: React.FC = () => {
    const [showRefreshMenu, setShowRefreshMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setShowRefreshMenu(true);
        };

        const handleClick = () => {
            setShowRefreshMenu(false);
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (!showRefreshMenu) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: menuPosition.y,
                left: menuPosition.x,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 2147483647,
                minWidth: '120px'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                onClick={handleRefresh}
                style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#1a2f53',
                    transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                <FaSync />&nbsp; Yangilash
            </div>
        </div>
    );
};

export default RefreshPage;
