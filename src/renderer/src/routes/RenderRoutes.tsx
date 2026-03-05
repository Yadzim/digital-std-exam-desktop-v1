import Layout from "components/structure/Layout"
import NonLayout from "components/structure/components/NonLayout"
import { Route } from "react-router-dom"


const RenderRoutes = ({ component: Component, structure }: any) => {

    return (
        <Route
            render={(props: any) => {
                if (structure === 'student_layout') {
                    return (
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    )
                } else {
                    return (
                        <NonLayout>
                            <Component {...props} />
                        </NonLayout>
                    )
                }
            }}
        />
    )
}

export default RenderRoutes;