(() => {
  const cfg = window.NABABI_CONFIG;
  const message = document.getElementById("coupon-message");
  const tbody = document.getElementById("coupon-table-body");
  const form = document.getElementById("coupon-form");

  if (!window.supabase || !cfg?.supabaseUrl || !cfg?.supabaseAnonKey) {
    if (message) message.textContent = "Supabase configuration is missing.";
    return;
  }

  const db = window.supabase.createClient(
    cfg.supabaseUrl,
    cfg.supabaseAnonKey
  );

  const el = id => document.getElementById(id);
  const money = n => "€" + Number(n || 0).toFixed(2);
  const say = text => {
    if (message) message.textContent = text;
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  async function hasSession() {
    const { data, error } = await db.auth.getSession();

    if (error || !data.session) {
      say("Please sign in through Admin.html first.");
      return false;
    }

    return true;
  }

  async function loadCoupons() {
    const { data: authData } = await db.auth.getSession();

    if (!authData.session) {
      tbody.innerHTML =
        '<tr><td colspan="7">Please sign in at Admin.html first.</td></tr>';
      return;
    }

    const { data, error } = await db
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      tbody.innerHTML =
        '<tr><td colspan="7">Could not load coupons: ' +
        escapeHtml(error.message) + "</td></tr>";
      return;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7">No coupons found.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(coupon => `
      <tr>
        <td>${escapeHtml(coupon.code)}</td>
        <td>${coupon.discount_type === "percent"
          ? escapeHtml(coupon.discount_value) + "%"
          : money(coupon.discount_value)}</td>
        <td>${money(coupon.min_order)}</td>
        <td>${escapeHtml(coupon.expires_at || "—")}</td>
        <td>${Number(coupon.used_count || 0)} / ${Number(coupon.usage_limit)}</td>
        <td>${coupon.is_active ? "Active" : "Inactive"}</td>
        <td>
          <button type="button" data-edit="${coupon.id}">Edit</button>
          <button type="button" data-toggle="${coupon.id}"
            data-active="${coupon.is_active}">
            ${coupon.is_active ? "Disable" : "Enable"}
          </button>
          <button type="button" data-delete="${coupon.id}">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  function resetForm() {
    form.reset();
    el("coupon-id").value = "";
    el("code").value = "NABABI10";
    el("discount-value").value = "10";
    el("min-order").value = "25";
    el("usage-limit").value = "100";
    el("is-active").checked = true;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!await hasSession()) return;

    const id = el("coupon-id").value;

    const coupon = {
      code: el("code").value.trim().toUpperCase(),
      discount_type: el("discount-type").value,
      discount_value: Number(el("discount-value").value),
      min_order: Number(el("min-order").value),
      expires_at: el("expires-at").value || null,
      usage_limit: Number(el("usage-limit").value),
      is_active: el("is-active").checked
    };

    if (!/^[A-Z0-9_-]{3,40}$/.test(coupon.code)) {
      say("Use 3–40 letters, numbers, underscores or hyphens for the code.");
      return;
    }

    if (
      !Number.isFinite(coupon.discount_value) ||
      coupon.discount_value <= 0 ||
      !Number.isFinite(coupon.min_order) ||
      coupon.min_order < 0 ||
      !Number.isInteger(coupon.usage_limit) ||
      coupon.usage_limit < 0 ||
      (coupon.discount_type === "percent" && coupon.discount_value > 100)
    ) {
      say("Please check the discount, minimum order and usage limit.");
      return;
    }

    const result = id
      ? await db.from("coupons").update(coupon).eq("id", id)
      : await db.from("coupons").insert(coupon);

    if (result.error) {
      say("Save failed: " + result.error.message);
      return;
    }

    say("Coupon saved.");
    resetForm();
    await loadCoupons();
  });

  tbody.addEventListener("click", async event => {
    const button = event.target.closest("button");
    if (!button || !await hasSession()) return;

    if (button.dataset.edit) {
      const { data, error } = await db
        .from("coupons")
        .select("*")
        .eq("id", button.dataset.edit)
        .single();

      if (error) {
        say(error.message);
        return;
      }

      el("coupon-id").value = data.id;
      el("code").value = data.code;
      el("discount-type").value = data.discount_type;
      el("discount-value").value = data.discount_value;
      el("min-order").value = data.min_order;
      el("expires-at").value = data.expires_at || "";
      el("usage-limit").value = data.usage_limit;
      el("is-active").checked = data.is_active;

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (button.dataset.toggle) {
      const { error } = await db
        .from("coupons")
        .update({ is_active: button.dataset.active !== "true" })
        .eq("id", button.dataset.toggle);

      say(error ? "Update failed: " + error.message : "Status updated.");
      await loadCoupons();
    }

    if (button.dataset.delete && confirm("Delete this coupon?")) {
      const { error } = await db
        .from("coupons")
        .delete()
        .eq("id", button.dataset.delete);

      say(error ? "Delete failed: " + error.message : "Coupon deleted.");
      await loadCoupons();
    }
  });

  el("reset").addEventListener("click", reset);
  loadCoupons();

  // Frontend validation helper only. It does not redeem a coupon or
  // atomically increase used_count. Redemption needs trusted server logic.
  window.NababiCoupons = {
    loadCoupons,

    async validateCoupon(code, orderTotal) {
      const total = Number(orderTotal);

      if (!Number.isFinite(total) || total < 0) {
        return { valid: false, message: "Invalid order total." };
      }

      const { data, error } = await db
        .from("coupons")
        .select("*")
        .eq("code", String(code).trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) {
        return { valid: false, message: "Invalid coupon." };
      }

      const today = new Date().toISOString().slice(0, 10);

      if (data.expires_at && data.expires_at < today) {
        return { valid: false, message: "Coupon expired." };
      }

      if (Number(data.used_count) >= Number(data.usage_limit)) {
        return { valid: false, message: "Usage limit reached." };
      }

      if (total < Number(data.min_order)) {
        return { valid: false, message: "Minimum order not reached." };
      }

      const rawDiscount = data.discount_type === "percent"
        ? total * Number(data.discount_value) / 100
        : Number(data.discount_value);

      const discount = Math.min(Math.max(rawDiscount, 0), total);

      return {
        valid: true,
        discount,
        finalTotal: Math.max(0, total - discount),
        coupon: data
      };
    }
  };
})();
