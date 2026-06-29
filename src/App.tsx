import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
 import AdministrativeOfficers from "./pages/grampanchayat/AdministrativeOfficers";
 import GramPanchayatManager  from "./pages/grampanchayat/GramPanchayatManager";
 import NoticeManager  from "./pages/grampanchayat/NoticeManager";
 import Suvichar  from "./pages/grampanchayat/Suvichar";
 import ContactList  from "./pages/grampanchayat/ContactList";
 import Events  from "./pages/grampanchayat/Events";
 import Gallery  from "./pages/grampanchayat/Gallery";
 import MahitiAdhikar  from "./pages/grampanchayat/MahitiAdhikar";
 import Awards  from "./pages/grampanchayat/Awards";
 import Reports  from "./pages/grampanchayat/Reports";
 import SwayamGhoshna  from "./pages/grampanchayat/SwayamGhoshna";
 import GovPrograms  from "./pages/grampanchayat/GovPrograms";
 import GloriousPersons  from "./pages/grampanchayat/GloriousPersons";
 import School  from "./pages/grampanchayat/School";
import Implink from "./pages/grampanchayat/Implink";
import { useEffect } from "react";
import Banner from "./pages/grampanchayat/Banner";
import MananiyAdhikari from "./pages/grampanchayat/MananiyAdhikari";
import ShashanNirnay  from "./pages/grampanchayat/ShashanNirnay";

export default function App() {

useEffect(() => {
  const checkExpiry = () => {
    const expiry = localStorage.getItem("expiry");

    if (!expiry) return;

    const expiryTime = Number(expiry);

    // Expired → logout instantly
    if (Date.now() > expiryTime) {
      localStorage.clear();
      window.location.replace("admin/login");
    }
  };

  // Run immediately
  checkExpiry();

  // Check every 1 second
  const interval = setInterval(checkExpiry, 1000);

  return () => clearInterval(interval);
}, []);




  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* 🔒 Protected Routes */}
            <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
            <Route index path="admin/" element={<Home />} />
            <Route path="admin/profile" element={<UserProfiles />} />
            <Route path="admin/administrative-officers" element={<AdministrativeOfficers />} />
            <Route path="admin/grambody" element={<GramPanchayatManager />} />
            <Route path="admin/notice-manager" element={<NoticeManager />} />
            <Route path="admin/contact-list" element={<ContactList />} />
            <Route path="admin/events" element={<Events />} />
            <Route path="admin/gallery" element={<Gallery />} />
            <Route path="admin/suvichar" element={<Suvichar />} />
            <Route path="admin/mahitiadhikar" element={<MahitiAdhikar />} />
            <Route path="admin/awards" element={<Awards />} />
            <Route path="admin/reports" element={<Reports />} />
            <Route path="admin/swayamghoshna" element={<SwayamGhoshna />} />
            <Route path="admin/govprograms" element={<GovPrograms />} />
            <Route path="admin/gloriouspersons" element={<GloriousPersons />} />
            <Route path="admin/school-info" element={<School />} />
            <Route path="admin/implinks" element={<Implink />} />
            <Route path="admin/banner" element={<Banner />} />
            <Route path="admin/mananiy-adhikari" element={<MananiyAdhikari />} />

            <Route path="admin/calendar" element={<Calendar />} />
            <Route path="admin/blank" element={<Blank />} />
            <Route path="admin/form-elements" element={<FormElements />} />
            {/* <Route path="admin/basic-tables" element={<BasicTables />} /> */}
            <Route path="admin/alerts" element={<Alerts />} />
            <Route path="admin/avatars" element={<Avatars />} />
            <Route path="admin/badge" element={<Badges />} />
            <Route path="admin/buttons" element={<Buttons />} />
            <Route path="admin/images" element={<Images />} />
            <Route path="admin/videos" element={<Videos />} />
            <Route path="admin/line-chart" element={<LineChart />} />
            <Route path="admin/bar-chart" element={<BarChart />} />
            <Route path="admin/shashanNirnay" element={<ShashanNirnay/>}/>
            
          </Route>
        </Route>

        {/* 🔓 Public Auth Routes */}
        <Route path="admin/login" element={<SignIn />} />
        <Route path="admin/signup" element={<SignUp />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
