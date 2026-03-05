import * as React from 'react';



const NonLayout = ({ children }: { children: React.ReactElement | React.ReactNode }): JSX.Element => {



    return (
        <>
            <div>
                {children}
            </div>
        </>
    )
}

export default NonLayout;