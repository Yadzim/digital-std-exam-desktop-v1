import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { public_routes, student_routes } from '.'
import RenderRoutes from "./RenderRoutes";
import NotFoundPage from "pages/common/Page_404";
import { useAppSelector } from "store/services";

const RoutesMiddleware = () => {

    const auth: any = useAppSelector(state => state.auth);

    if (auth.isAuthenticated) {

        return (
            <Switch>
                {
                    student_routes.map((e, i) => {
                        return (
                            <RenderRoutes
                                key={i}
                                path={e.path}
                                component={e.component}
                                structure={e.config.structure}
                                exact={e.config.exact}
                            />
                        )
                    })
                }
                <Route component={NotFoundPage} />
            </Switch>
        )
    }

    return (
        <Switch>
            {
                public_routes.map((e: any, i: number) => {
                    return (
                        <RenderRoutes
                            key={i}
                            path={e.path}
                            component={e.component}
                            structure={e.config.structure}
                            exact={e.config.exact}
                        />
                    )
                })
            }
            <Redirect to={!localStorage.getItem('access_token') ? '/' : window.location.pathname} />
        </Switch>
    )

}


export default RoutesMiddleware;