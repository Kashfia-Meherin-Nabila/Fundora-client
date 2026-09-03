"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, TextArea } from "@heroui/react";
import { PencilToSquare, Xmark } from "@gravity-ui/icons";
import toast from "react-hot-toast";

export default function EditCampaignModal({ campaign, refetch }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load existing campaign data
  useEffect(() => {
    if (campaign) {
      reset({
        campaign_title: campaign.campaign_title || "",
        campaign_story: campaign.campaign_story || "",
        category: campaign.category || "",
        funding_goal: campaign.funding_goal || "",
        minimum_contribution: campaign.minimum_contribution || "",
        deadline: campaign.deadline
          ? new Date(campaign.deadline).toISOString().split("T")[0]
          : "",
        reward_info: campaign.reward_info || "",
        campaign_image_url: campaign.campaign_image_url || "",
      });
    }
  }, [campaign, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const updateData = {
        campaign_title: data.campaign_title,
        campaign_story: data.campaign_story,
        category: data.category,
        funding_goal: Number(data.funding_goal),
        minimum_contribution: Number(data.minimum_contribution),
        deadline: data.deadline,
        reward_info: data.reward_info,
        campaign_image_url: data.campaign_image_url,

        // Keep creator information unchanged
        creator_email: campaign.creator_email,
        creator_name: campaign.creator_name,

        // Keep existing values
        raised_amount: campaign.raised_amount || 0,
        status: campaign.status,
        updatedAt: new Date(),
      };

      const response = await fetch(
        `http://localhost:5000/api/campaigns/${campaign._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update campaign"
        );
      }

      toast.success("Campaign updated successfully");

      setOpen(false);

      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error("Update campaign error:", error);

      toast.error(
        error.message || "Failed to update campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* EDIT BUTTON */}
      {/* Plain button prevents nested HeroUI button issue */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-800 p-2 transition hover:bg-violet-600"
        title="Edit Campaign"
      >
        <PencilToSquare
          width={18}
          height={18}
          className="text-violet-400"
        />
      </button>

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
      >
        <Modal.Backdrop>
          <Modal.Container placement="center">
            <Modal.Dialog className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950">

              {/* HEADER */}

              <Modal.Header className="border-b border-white/10 px-6 py-5">

                <div>
                  <Modal.Heading className="text-xl font-bold text-white">
                    Edit Campaign
                  </Modal.Heading>

                  <p className="mt-1 text-sm text-slate-400">
                    Update your campaign information
                  </p>
                </div>

                {/* IMPORTANT:
                    Do NOT put another Button inside CloseTrigger
                */}

                <Modal.CloseTrigger>
                  <Xmark
                    width={20}
                    height={20}
                  />
                </Modal.CloseTrigger>

              </Modal.Header>

              {/* BODY */}

              <Modal.Body className="px-6 py-6">

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >

                  {/* Campaign Title */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Campaign Title
                    </label>

                    <input
                      {...register("campaign_title", {
                        required: "Campaign title is required",
                      })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />

                    {errors.campaign_title && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.campaign_title.message}
                      </p>
                    )}
                  </div>

                  {/* Campaign Story */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Campaign Story
                    </label>

                    <TextArea
                      {...register("campaign_story", {
                        required: "Campaign story is required",
                      })}
                      className="w-full"
                    />

                    {errors.campaign_story && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.campaign_story.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Category
                    </label>

                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option value="">
                        Select Category
                      </option>

                      <option value="Technology">
                        Technology
                      </option>

                      <option value="Art">
                        Art
                      </option>

                      <option value="Community">
                        Community
                      </option>

                      <option value="Health">
                        Health
                      </option>

                      <option value="Environment">
                        Environment
                      </option>

                      <option value="Education">
                        Education
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                    {errors.category && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Funding + Minimum */}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Funding Goal
                      </label>

                      <input
                        type="number"
                        {...register("funding_goal", {
                          required: "Funding goal is required",
                          min: {
                            value: 1,
                            message: "Must be greater than 0",
                          },
                        })}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                      />

                      {errors.funding_goal && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.funding_goal.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Minimum Contribution
                      </label>

                      <input
                        type="number"
                        {...register("minimum_contribution", {
                          required:
                            "Minimum contribution is required",
                          min: {
                            value: 1,
                            message: "Must be greater than 0",
                          },
                        })}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                      />

                      {errors.minimum_contribution && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.minimum_contribution.message}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Deadline */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Deadline
                    </label>

                    <input
                      type="date"
                      {...register("deadline", {
                        required: "Deadline is required",
                      })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    />

                    {errors.deadline && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.deadline.message}
                      </p>
                    )}
                  </div>

                  {/* Reward */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Reward Information
                    </label>

                    <TextArea
                      {...register("reward_info", {
                        required: "Reward information is required",
                      })}
                      className="w-full"
                    />

                    {errors.reward_info && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.reward_info.message}
                      </p>
                    )}
                  </div>

                  {/* Image URL */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Campaign Image URL
                    </label>

                    <input
                      type="url"
                      {...register("campaign_image_url", {
                        required:
                          "Campaign image URL is required",
                      })}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                    />

                    {errors.campaign_image_url && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.campaign_image_url.message}
                      </p>
                    )}
                  </div>

                  {/* BUTTONS */}

                  <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Updating..."
                        : "Update Campaign"}
                    </button>

                  </div>

                </form>

              </Modal.Body>

            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}