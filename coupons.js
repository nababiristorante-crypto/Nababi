
const SUPABASE_URL = "https://ihejhfpmqpgvpskdzase.supabase.co";
const SUPABASE_KEY = "sb_publishable_rQba64JvEc3kJNGEm3rvpA_IyO4gvi-";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// Coupon Box-এ সব কুপন দেখাবে
async function loadCoupons() {
  const { data, error } = await supabaseClient
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Coupons load failed:", error.message);
    return [];
  }

  return data || [];
}

// নতুন কুপন তৈরি করবে
async function addCoupon(coupon) {
  const { data, error } = await supabaseClient
    .from("coupons")
    .insert([{
      code: coupon.code.trim().toUpperCase(),
      discount_type: coupon.discount_type || "percent",
      discount_value: Number(coupon.discount_value),
      min_order: Number(coupon.min_order || 0),
      expires_at: coupon.expires_at || null,
      usage_limit: Number(coupon.usage_limit || 0),
      used_count: 0,
      is_active: coupon.is_active ?? true
    }])
    .select()
    .single();

  if (error) {
    console.error("Coupon create failed:", error.message);
    throw error;
  }

  return data;
}

// কুপন আপডেট করবে
async function updateCoupon(id, changes) {
  const { data, error } = await supabaseClient
    .from("coupons")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Coupon update failed:", error.message);
    throw error;
  }

  return data;
}

// কুপন চালু / বন্ধ করবে
async function toggleCoupon(id, isActive) {
  return updateCoupon(id, { is_active: isActive });
}

// কুপন মুছে ফেলবে
async function deleteCoupon(id) {
  const { error } = await supabaseClient
    .from("coupons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Coupon delete failed:", error.message);
    throw error;
  }

  return true;
}

// অর্ডারে কুপন বৈধ কি না পরীক্ষা করবে
async function validateCoupon(code, orderTotal) {
  const { data, error } = await supabaseClient
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return { valid: false, message: "Coupon not found or inactive." };
  }

  if (data.expires_at &&
      new Date(data.expires_at) < new Date()) {
    return { valid: false, message: "Coupon has expired." };
  }

  if (Number(orderTotal) < Number(data.min_order || 0)) {
    return {
      valid: false,
      message: `Minimum order is €${data.min_order}.`
    };
  }

  if (Number(data.usage_limit) > 0 &&
      Number(data.used_count) >= Number(data.usage_limit)) {
    return { valid: false, message: "Coupon usage limit reached." };
  }

  const discount = data.discount_type === "percent"
    ? Number(orderTotal) * Number(data.discount_value) / 100
    : Number(data.discount_value);

  return {
    valid: true,
    coupon: data,
    discount: Math.min(discount, Number(orderTotal)),
    finalTotal: Math.max(0, Number(orderTotal) - discount)
  };
}
