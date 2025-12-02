/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Select, { type MultiValue, type SingleValue } from "react-select";
import axios from "axios";
import { ClassroomService } from "../../services/ClassroomService";
import type { UserType } from "../../types/userType";
import type { ClassroomType } from "../../types/classroomType";
import { Loader } from "lucide-react";

// Types for classroom & student
export interface Student {
  _id: string;
  fullName: string;
  regNumber?: string;
  gender?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  classrooms: ClassroomType[];
  onSubmit: (data: { studentIds: string[]; newClassId: string }) => void;
  loading?: boolean;
}

const PromoteStudentModal: React.FC<Props> = ({
  open,
  onClose,
  classrooms = [],
  onSubmit,
  loading,
}) => {
  // State
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<UserType[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [newClassId, setNewClassId] = useState<string>("");

  // fetch students when class changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      try {
        const res = await ClassroomService.getStudentsInAClass(selectedClass);
        setStudents(res);
      } catch (err) {
        console.error(err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleSubmit = () => {
    onSubmit({
      studentIds: selectedStudents.map((s) => s._id),
      newClassId,
    });
  };

  // react-select options
  const classOptions = classrooms?.map((cls) => ({
    value: cls._id,
    label: cls.className,
  }));

  const studentOptions = students.map((st) => ({
    value: st._id,
    label: `${st.fullName} (${st.regNumber || ""})`,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: '#d1d5db',
      padding: '0rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#5A38FD',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#5A38FD'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
    }),
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      sx={{
        backdropFilter: "blur(6px)", // blur background
        backgroundColor: "rgba(0,0,0,0.2)"
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Promote Students</DialogTitle>
      <DialogContent>
        {/* 1. Select current class */}
        <div className="mb-4">
          <label className="font-semibold mb-1 block">Select Current Class</label>
          <Select
            options={classOptions}
            onChange={(option: SingleValue<{ value: string; label: string }>) => {
              setSelectedClass(option?.value || "");
              setSelectedStudents([]);
            }}
            value={classOptions.find((o) => o.value === selectedClass) || null}
            placeholder="Select a class"
            styles={customStyles}
            maxMenuHeight={100}
          />
        </div>

        {/* 2. Select students */}
        <div className="mb-4">
          <label className="font-semibold mb-1 block">Select Students</label>
          <Select
            isMulti
            options={studentOptions}
            value={studentOptions.filter((o) =>
              selectedStudents.some((s) => s._id === o.value)
            )}
            onChange={(
              options: MultiValue<{ value: string; label: string }>
            ) => {
              const selected = options
                .map((o) => students.find((s) => s._id === o.value))
                .filter((s): s is UserType => s !== undefined);
              setSelectedStudents(selected);
            }}
            placeholder="Select students to promote"
            isDisabled={!selectedClass}
            styles={customStyles}
            maxMenuHeight={100}
          />
        </div>

        {/* 3. Select new class */}
        <div className="mb-4">
          <label className="font-semibold mb-1 block">Select New Class</label>
          <Select
            options={classOptions}
            onChange={(option: SingleValue<{ value: string; label: string }>) =>
              setNewClassId(option?.value || "")
            }
            value={classOptions.find((o) => o.value === newClassId) || null}
            placeholder="Select a new class"
            isDisabled={!selectedStudents.length}
            maxMenuHeight={100}
            styles={customStyles}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}
          sx={{
            color: "#5A38FD",
          }}
        >Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedStudents.length || !newClassId}
          sx={{
            backgroundColor: (!selectedStudents.length || !newClassId) ? '#d1d5db' : '#5A38FD',
            padding: "8px 20px",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#0f172b",
            },
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Promote
            </span>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromoteStudentModal;