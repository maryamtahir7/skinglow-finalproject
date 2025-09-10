import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const DeleteProduct = ({ product, onConfirm, onCancel }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()} // prevent close on card click
        >
          <Card className="w-full max-w-md shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-600">
                Delete Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{product.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onConfirm(product.$id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteProduct;
