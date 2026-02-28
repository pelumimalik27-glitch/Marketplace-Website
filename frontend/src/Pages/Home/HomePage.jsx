import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Home/Hero";
import TrustSection from "../../components/Home/TrustSection";
import ShopCategory from "../../components/Home/ShopCategory";
import FlashDeal from "../../components/Home/FlashDeal";
import ProductData from "../../components/Home/ProductData";
import { AppContext } from "../../contexts/AppContext";
import { becomeSeller, fetchSellerApplicationStatus } from "../../lib/sellerApi";

const initialForm = {
  storeName: "",
  contactPhone: "",
  businessAddress: "",
  paymentDetails: "",
  idNumber: "",
  storeDescription: "",
};

function HomePage() {
  const navigate = useNavigate();
  const { user, isLogin, handleLogin } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [application, setApplication] = useState(null);
  const [statusText, setStatusText] = useState("");

  const isApprovedSeller = user?.roles?.includes("seller");
  const applicationStatus = application?.status || null;
  const applyAuthPayload = (payload = {}) => {
    if (!payload?.user) return;
    const currentToken = localStorage.getItem("userToken");
    handleLogin({
      token: payload?.accessToken || currentToken,
      user: payload.user,
    });
  };

  const syncApplicationStatus = async () => {
    if (!isLogin) {
      setApplication(null);
      setStatusText("");
      return null;
    }

    try {
      const response = await fetchSellerApplicationStatus();
      const payload = response?.data || {};
      const sellerApplication = payload?.sellerApplication || null;
      setApplication(sellerApplication);

      applyAuthPayload(payload);

      if (sellerApplication?.status === "pending") {
        setStatusText("Seller application submitted. Waiting for admin approval.");
      } else if (sellerApplication?.status === "rejected") {
        setStatusText("Your seller application was rejected. Update and re-apply.");
      } else if (sellerApplication?.status === "approved") {
        setStatusText("Seller application approved. You can open the seller dashboard.");
      } else {
        setStatusText("");
      }
      return { sellerApplication, userFromServer: payload?.user || null };
    } catch (error) {
      setStatusText("");
      return null;
    }
  };

  useEffect(() => {
    syncApplicationStatus();
  }, [isLogin, user?.userId]);

  const handleOpenSellerFlow = async () => {
    if (!isLogin) {
      navigate("/authpage?mode=login", {
        state: { redirectTo: "/", mode: "login" },
      });
      return;
    }

    setCheckingStatus(true);
    const syncResult = await syncApplicationStatus();
    setCheckingStatus(false);

    const latestApplication = syncResult?.sellerApplication || null;
    const latestUserRoles = Array.isArray(syncResult?.userFromServer?.roles)
      ? syncResult.userFromServer.roles
      : [];
    const latestStatus = latestApplication?.status || applicationStatus;
    const latestApprovedByRole = isApprovedSeller || latestUserRoles.includes("seller");

    if (latestApprovedByRole || latestStatus === "approved") {
      navigate("/seller");
      return;
    }

    if (latestStatus === "pending") {
      setStatusText("Your application is pending admin approval.");
      return;
    }

    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await becomeSeller(formData);
      const payload = response?.data || {};
      const sellerApplication = payload?.sellerApplication || null;
      setApplication(sellerApplication);

      applyAuthPayload(payload);

      setStatusText(
        response?.message || "Seller application submitted. Waiting for admin approval."
      );
      setShowForm(false);
      setFormData(initialForm);
    } catch (error) {
      alert(error.message || "Failed to submit seller application");
    } finally {
      setSubmitting(false);
    }
  };

  const sellerButtonLabel = (() => {
    if (!isLogin) return "Become a Seller";
    if (isApprovedSeller || applicationStatus === "approved") return "Open Seller Dashboard";
    if (applicationStatus === "pending") return "Application Pending";
    if (applicationStatus === "rejected") return "Re-apply as Seller";
    return "Apply to Become Seller";
  })();

  return (
    <div className="min-h-screen">
      <Hero />
      <TrustSection />

      <section className="bg-gray-800 px-4 py-10 text-center text-white sm:px-6 sm:py-12">
        <h2 className="text-xl font-bold sm:text-2xl">Start Selling on Our Marketplace</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300 sm:text-base">
          Submit your seller details and wait for admin approval before accessing seller tools.
        </p>

        <button
          type="button"
          onClick={handleOpenSellerFlow}
          disabled={checkingStatus || submitting}
          className="mt-6 rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-200 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingStatus ? "Checking..." : sellerButtonLabel}
        </button>

        {statusText && <p className="mt-3 text-sm text-orange-200">{statusText}</p>}
      </section>

      <ShopCategory />
      <FlashDeal />
      <ProductData />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-5">
            <h3 className="text-lg font-semibold text-gray-900">Seller Application Form</h3>
            <p className="mt-1 text-sm text-gray-600">
              Fill in your details. Status will remain pending until admin approves.
            </p>

            <form onSubmit={handleSubmitApplication} className="mt-4 space-y-3">
              <input
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Store Name"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
              <input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Contact Phone"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
              <input
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Business Address"
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <input
                name="paymentDetails"
                value={formData.paymentDetails}
                onChange={handleChange}
                placeholder="Payment Details"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
              <input
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Government ID Number"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                placeholder="Store Description"
                className="w-full rounded border px-3 py-2 text-sm"
                rows={3}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-orange-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
