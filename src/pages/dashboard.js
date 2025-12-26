import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import Dashboard from "@/components/Dashboard/dashboard";

const dashboard = () => {

    return (
        <>
            <Layout >
                <Dashboard/>
            </Layout>
        </>
    )
}
export default withAuth(dashboard);