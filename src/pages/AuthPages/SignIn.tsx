import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="पळसुन ग्रामपंचायत"
        description="पळसुन ग्रामपंचायत"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
