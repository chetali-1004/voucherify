"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

interface VoucherFormData {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  target: "product" | "shipping" | "cart";
  applicableProducts?: string[];
  percentageDiscount?: string;
  fixedDiscount?: string;
  startDate: string;
  endDate: string;
  allowedUsers?: string[];
  maxUsesPerUser?: string;
  minCartValue: string;
  maxDiscountAmount?: string;
  maxUses: string;
  redeemableDays?: string[];
}

const CreateVoucherPage: React.FC = () => {
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const { register, handleSubmit } = useForm<VoucherFormData>();
  const [type, setType] = useState("percentage");
  const router = useRouter();

  const onSubmit: SubmitHandler<VoucherFormData> = async (data) => {
    try {
      const parsedData = {
        ...data,
        percentageDiscount: data.percentageDiscount
          ? parseFloat(data.percentageDiscount)
          : undefined,
        fixedDiscount: data.fixedDiscount
          ? parseFloat(data.fixedDiscount)
          : undefined,
        minCartValue: parseFloat(data.minCartValue),
        maxDiscountAmount: data.maxDiscountAmount
          ? parseFloat(data.maxDiscountAmount)
          : undefined,
        maxUses: parseInt(data.maxUses, 10),
        maxUsesPerUser: data.maxUsesPerUser
          ? parseInt(data.maxUsesPerUser, 10)
          : undefined,
      };
      const response = await axios.post(
        "http://localhost:3000/voucher",
        parsedData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Voucher created successfully:", response.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating voucher:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
      <div className="bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-3xl mt-10">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Create a Voucher
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Voucher Code */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Voucher Code
            </label>
            <input
              type="text"
              {...register("code", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter a unique voucher code"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">Type</label>
            <select
              {...register("type", { required: true })}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {type === "percentage" && (
            <div>
              <label className="block text-gray-400 font-medium mb-1">
                Percentage Discount
              </label>
              <input
                type="number"
                {...register("percentageDiscount", { required: true })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="Enter percentage discount"
              />
            </div>
          )}
          {type === "percentage" && (
            <div>
              <label className="block text-gray-400 font-medium mb-1">
                Max Discount Amount
              </label>
              <input
                type="number"
                {...register("maxDiscountAmount")}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="Enter maximum discount amount"
              />
            </div>
          )}
          {type === "fixed" && (
            <div>
              <label className="block text-gray-400 font-medium mb-1">
                Fixed Discount
              </label>
              <input
                type="number"
                {...register("fixedDiscount", { required: true })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="Enter fixed discount amount"
              />
            </div>
          )}

          {/* Min Cart Value */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Minimum Cart Value
            </label>
            <input
              type="number"
              {...register("minCartValue", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter minimum cart value"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Target
            </label>
            <select
              {...register("target", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            >
              <option value="product">Product</option>
              <option value="shipping">Shipping</option>
              <option value="cart">Cart</option>
            </select>
          </div>

          {/* Other Fields */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Applicable Products (comma-separated)
            </label>
            <input
              type="text"
              {...register("applicableProducts")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter product IDs"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Allowed Users (comma-separated)
            </label>
            <input
              type="text"
              {...register("allowedUsers")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter user IDs"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Max Uses Per User
            </label>
            <input
              type="number"
              {...register("maxUsesPerUser")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter maximum uses per user"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Max Uses
            </label>
            <input
              type="number"
              {...register("maxUses", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter maximum uses"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Redeemable Days (comma-separated)
            </label>
            <input
              type="text"
              {...register("redeemableDays")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter redeemable days (e.g., Monday, Tuesday)"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create Voucher
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucherPage;
