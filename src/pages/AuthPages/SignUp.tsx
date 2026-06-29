import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="पळसुन ग्रामपंचायत"
        description="पळसुन ग्रामपंचायत"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
