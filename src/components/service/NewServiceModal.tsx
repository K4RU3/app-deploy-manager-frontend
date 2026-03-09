import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { repositoryUrl: string; branch?: string }) => Promise<void>;
}

export function NewServiceModal({ isOpen, onClose, onSubmit }: NewServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branch, setBranch] = useState("main");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repositoryUrl) return;

    setLoading(true);
    try {
      await onSubmit({ repositoryUrl, branch: branch || undefined });
      onClose();
      setRepositoryUrl("");
      setBranch("main");
    } catch (err) {
      console.error("Failed to create service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Service">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              Git Repository URI
            </label>
            <input
              required
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/user/repo.git"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              Branch (Optional)
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <p className="text-xs text-zinc-500">
            The system will automatically detect configuration from the repository.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !repositoryUrl}>
            {loading ? "Adding..." : "Add Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
