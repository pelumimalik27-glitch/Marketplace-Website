import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fetchMySellerProfile, updateSellerProfile } from "../../lib/sellerApi";

const defaultForm = {
  storeName: "",
  contactPhone: "",
  businessAddress: "",
  paymentDetails: "",
  idNumber: "",
  verificationNotes: "",
};

function SellerSettings() {
  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sellerProfile, setSellerProfile] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const profile = await fetchMySellerProfile(user?.userId);
      setSellerProfile(profile);
      setForm({
        storeName: profile?.storeName || "",
        contactPhone: profile?.contactPhone || "",
        businessAddress: profile?.businessAddress || "",
        paymentDetails: profile?.paymentDetails || "",
        idNumber: profile?.idNumber || "",
        verificationNotes: profile?.verificationNotes || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load seller settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user?.userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!sellerProfile?._id) {
      setError("Seller profile not found.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        storeName: form.storeName.trim(),
        contactPhone: form.contactPhone.trim(),
        businessAddress: form.businessAddress.trim(),
        paymentDetails: form.paymentDetails.trim(),
        idNumber: form.idNumber.trim(),
        verificationNotes: form.verificationNotes.trim(),
      };

      const response = await updateSellerProfile(sellerProfile._id, payload);
      const updated = response?.data || null;
      if (updated) {
        setSellerProfile(updated);
      }
      setSuccess("Settings updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100vh-11rem)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Store Settings</h1>
          <p className="text-sm text-slate-600">Manage your seller profile and payout details</p>
        </div>
        <button
          onClick={loadSettings}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="rounded border bg-white p-4 text-sm">Loading...</div>}
      {!loading && error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && success && (
        <div className="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {!loading && (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Store name</label>
                <input
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Contact phone</label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Business address</label>
                <input
                  name="businessAddress"
                  value={form.businessAddress}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment details</label>
                <textarea
                  name="paymentDetails"
                  value={form.paymentDetails}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">ID number</label>
                <input
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Application status</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {sellerProfile?.status || "-"}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Admin notes</label>
                <textarea
                  name="verificationNotes"
                  value={form.verificationNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-orange-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SellerSettings;
