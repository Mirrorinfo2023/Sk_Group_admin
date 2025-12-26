import LoginPage from "@/components/Login/LoginPage";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
const Login = () => {

    const router = useRouter();

    const { service_id } = router.query;

    return ( 
        <div >
            <div>
                {service_id ? <LoginPage service_id={service_id} /> : <LoginPage />}
            </div>
        </div>
    )
}
export default withUserCheck(Login);