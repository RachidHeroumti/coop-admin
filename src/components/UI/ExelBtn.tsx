import { ArrowDownToLine } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
export const ExelBtn = () => {
  const { addToast } = useToast();
  const handleExelFile = () => {
    addToast("success", "Excel file exported successfully");
  };
  return (
    <label
      htmlFor="excelFile"
      className="bg-green-500 px-4 py-2 flex gap-2 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200 cursor-pointer"
    >
      <ArrowDownToLine className="h-5" />
      <span>Export Excel File</span>
      <input
        id="excelFile"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExelFile}
        className="hidden"
      />
    </label>
  );
};
