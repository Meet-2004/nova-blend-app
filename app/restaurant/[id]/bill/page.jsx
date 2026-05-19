"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RestaurantBill() {
  const router = useRouter();
  const params = useParams();
  const orderId = useSelector((s) => s.dineIn.orderId);

  useEffect(() => {
    if (orderId) router.replace(`/order/${orderId}/bill`);
    else router.replace(`/restaurant/${params.id}/menu`);
  }, [orderId, params.id, router]);

  return null;
}
