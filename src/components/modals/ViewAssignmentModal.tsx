import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Stack,
    Link,
    Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import type { AssignmentType } from "../../types/assignmentType";

interface Props {
    open: boolean;
    onClose: () => void;
    assignment: AssignmentType | null;
}

export default function ViewAssignmentModal({
    open,
    onClose,
    assignment,
}: Props) {
    if (!assignment) return null;
    // console.log(assignment)

    const due = new Date(assignment.dueDate);
    const created = assignment.createdAt ? new Date(assignment.createdAt) : null;

    const formattedDate = (d: Date | null) =>
        d
            ? d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "-";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            sx={{
                backdropFilter: "blur(6px)", // blur background
                backgroundColor: "rgba(0,0,0,0.2)"
            }}
        >
            <DialogTitle sx={{ bgcolor: "background.paper", py: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                >
                    <Avatar sx={{ bgcolor: "#5A38FD", width: 56, height: 56 }}>
                        <SchoolIcon />
                    </Avatar>

                    <Box flex={1} width="100%">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {assignment.topic}
                        </Typography>
                        <Stack
                            direction={{ xs: "column", sm: "row" }} // chips wrap on mobile
                            spacing={1}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            mt={0.5}
                        >
                            <Chip label={assignment.classId.className} size="small" />
                            <Chip label={assignment.subjectId.subjectName} size="small" />
                            <Chip label={assignment.teacherId.fullName} size="small" />
                        </Stack>
                    </Box>

                    <Stack
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                        mt={{ xs: 1, sm: 0 }} // add some top margin on mobile
                    >
                        <Typography variant="body2" color="text.secondary">
                            Due
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {formattedDate(due)}
                        </Typography>
                    </Stack>
                </Stack>
            </DialogTitle>


            <DialogContent dividers sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box flex={2}>
                        <Box mb={1} display="flex" alignItems="center" gap={1}>
                            <DescriptionIcon fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">
                                Description
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: 1,
                                px: 2,
                                py: 2,
                                borderRadius: 1,
                                bgcolor: "background.default",
                                minHeight: 120,
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: assignment.description }}
                                style={{ color: "#222", lineHeight: 1.6 }}
                            />
                        </Box>

                        {assignment.resources && assignment.resources.length > 0 && (
                            <Box mt={3}>
                                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                                    Resources
                                </Typography>
                                <Stack spacing={1}>
                                    {assignment.resources.map((url, index) => {
                                        const fileName = url.split('/').pop() || `Resource ${index + 1}`;
                                        return (
                                            <Box
                                                key={index}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                p={1.5}
                                                bgcolor="background.default"
                                                borderRadius={1}
                                                border="1px solid"
                                                borderColor="divider"
                                            >
                                                <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                                                    {fileName}
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        size="small"
                                                        component={Link}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        startIcon={<OpenInNewIcon />}
                                                        variant="outlined"
                                                        sx={{ color: "#5A38FD", borderColor: "#5A38FD", "&:hover": { bgcolor: "#f3f4f6", borderColor: "#5A38FD" } }}
                                                    >
                                                        Open
                                                    </Button>
                                                    <IconButton
                                                        component="a"
                                                        href={url}
                                                        download={fileName}
                                                        size="small"
                                                        aria-label="download"
                                                        title="Download"
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </Box>

                    <Box
                        flex={1}
                        sx={{
                            borderLeft: { md: "1px solid" },
                            borderColor: "divider",
                            pl: { md: 3 },
                        }}
                    >
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Assignment Info
                        </Typography>

                        <Stack spacing={1.1}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Class
                                </Typography>
                                <Typography variant="body2">
                                    {assignment.classId.className}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Subject
                                </Typography>
                                <Typography variant="body2">
                                    {assignment.subjectId.subjectName}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Teacher
                                </Typography>
                                <Typography variant="body2">
                                    {assignment.teacherId.fullName}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Created
                                </Typography>
                                <Typography variant="body2">{formattedDate(created)}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Updated
                                </Typography>
                                <Typography variant="body2">
                                    {assignment.updatedAt
                                        ? formattedDate(new Date(assignment.updatedAt))
                                        : "-"}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={1} alignItems="center" mt={1}>
                                <CalendarTodayIcon fontSize="small" color="action" />
                                <Typography variant="body2">{formattedDate(due)}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="text" sx={{ color: "#5A38FD", "&:hover": { bgcolor: "#f3f4f6" } }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}