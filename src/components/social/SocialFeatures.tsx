import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  StudyGroup,
  StudyPlan,
  GroupFile,
  NewGroupData,
  synchronizeGroupFiles,
} from "./types";
import { StudyGroupProvider, useStudyGroups } from "./StudyGroupContext";
import GroupList from "./GroupList";
import GroupDetail from "./GroupDetail";
import CreateStudyPlan from "./study-plan/CreateStudyPlan";
import GenerateStudyPlan from "./study-plan/GenerateStudyPlan";
import CreateGroupModal from "./modals/CreateGroupModal";
import AddMemberModal from "./modals/AddMemberModal";
import UploadFileModal from "./modals/UploadFileModal";
import { FileProcessor } from "../../services/fileProcessor";

interface SocialFeaturesProps {}

const SocialFeaturesContent: React.FC = () => {
  const { user } = useAuth();
  const { studyGroups, selectedGroup, setStudyGroups, setSelectedGroup } = useStudyGroups();

  // UI state
  const [activeView, setActiveView] = useState<string>("groups-list");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] =
    useState<boolean>(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] =
    useState<boolean>(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form data
  const [newGroupData, setNewGroupData] = useState<NewGroupData>({
    name: "",
    description: "",
    topic: "",
    difficulty: "intermediate",
  });
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");

  // Create a new group
  const createGroup = () => {
    if (!user) return;

    const newGroup: StudyGroup = {
      id: Date.now().toString(),
      name: newGroupData.name,
      description: newGroupData.description,
      topic: newGroupData.topic,
      difficulty: newGroupData.difficulty,
      adminId: user.id,
      adminName: user.name || user.email.split("@")[0],
      isPublic: newGroupData.isPublic || false,
      createdAt: new Date(),
      lastActivity: new Date(),
      members: [
        {
          id: user.id,
          name: user.name || user.email.split("@")[0],
          email: user.email,
          role: "admin",
          avatar: user.avatar || "",
          joinedAt: new Date(),
          isActive: true,
        },
      ],
      files: [],
      memberProgress: {},
    };

    setStudyGroups([...studyGroups, newGroup]);
    setSelectedGroup(newGroup);
    setNewGroupData({
      name: "",
      description: "",
      topic: "",
      difficulty: "intermediate",
    });
    setIsCreateGroupModalOpen(false);
    setActiveView("group-detail");
  };

  // Add a member to the selected group
  const addMember = () => {
    if (!selectedGroup || !newMemberEmail.trim()) return;

    const updatedGroup = { ...selectedGroup };
    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: "member" as const,
      avatar: "",
      joinedAt: new Date(),
      isActive: true,
    };

    updatedGroup.members = [...(updatedGroup.members || []), newMember];

    // Initialize member progress if study plan exists
    if (updatedGroup.studyPlan) {
      const totalTasks =
        updatedGroup.studyPlan.schedule?.reduce(
          (sum, day) => sum + (day.tasks?.length || 0),
          0
        ) || 0;

      updatedGroup.memberProgress = {
        ...(updatedGroup.memberProgress || {}),
        [newMember.id]: {
          completedTasks: 0,
          totalTasks,
          lastActive: new Date(),
        },
      };
    }

    const updatedGroups = studyGroups.map((g) =>
      g.id === selectedGroup.id ? updatedGroup : g
    );

    setStudyGroups(updatedGroups);
    setSelectedGroup(updatedGroup);
    setNewMemberEmail("");
    setIsAddMemberModalOpen(false);
  };

  // Handle file upload for the selected group
  const handleFileUpload = async (file: File) => {
    if (!selectedGroup || !user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file size
      const isValidSize = FileProcessor.validateFileSize(file);

      if (!isValidSize) {
        setUploadError("File size exceeds the maximum allowed limit (25MB)");
        setIsUploading(false);
        return;
      }

      // Check if file type is supported
      const supportedTypes = FileProcessor.getSupportedFileTypes();
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      const isValidType =
        supportedTypes.includes(fileExtension.toLowerCase()) ||
        file.type.includes("pdf") ||
        file.type.includes("docx") ||
        file.type.includes("text");

      if (!isValidType) {
        setUploadError(
          "File format not supported. Please upload PDF, DOCX, TXT, MD, RTF, TEX, or BIB files."
        );
        setIsUploading(false);
        return;
      }

      const content = await FileProcessor.extractTextFromFile(file);
      const newFile: GroupFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: user.name || user.email.split("@")[0],
        content,
      };

      const updatedGroup = { ...selectedGroup };
      updatedGroup.files = [...(updatedGroup.files || []), newFile];

      // Synchronize files with study plan if it exists
      if (updatedGroup.studyPlan) {
        synchronizeGroupFiles(updatedGroup);
      }

      const updatedGroups = studyGroups.map((g) =>
        g.id === selectedGroup.id ? updatedGroup : g
      );

      setStudyGroups(updatedGroups);
      setSelectedGroup(updatedGroup);
      setIsUploading(false);
      setIsUploadFileModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to process file");
      setIsUploading(false);
    }
  };

  // Handle form submission for creating a study plan
  const handleFormSubmit = (plan: StudyPlan) => {
    if (!selectedGroup || !user) return;

    const updatedGroup = { ...selectedGroup };
    updatedGroup.studyPlan = plan;

    // Initialize progress tracking for all members
    const totalTasks =
      plan.schedule?.reduce((sum, day) => sum + (day.tasks?.length || 0), 0) ||
      0;

    updatedGroup.memberProgress = {};
    updatedGroup.members?.forEach((member) => {
      updatedGroup.memberProgress![member.id] = {
        completedTasks: 0,
        totalTasks,
        lastActive: new Date(),
      };
    });

    // Synchronize with files
    synchronizeGroupFiles(updatedGroup);

    const updatedGroups = studyGroups.map((g) =>
      g.id === selectedGroup.id ? updatedGroup : g
    );

    setStudyGroups(updatedGroups);
    setSelectedGroup(updatedGroup);
    setActiveView("group-detail");
  };

  // Handle generated plan from AI
  const handlePlanGenerated = (plan: StudyPlan) => {
    handleFormSubmit(plan);
  };

  // Handle task completion
  const handleTaskComplete = (
    memberId: string,
    taskId: string,
    completed: boolean
  ) => {
    if (!selectedGroup || !selectedGroup.studyPlan) return;

    const updatedGroup = { ...selectedGroup };
    const memberProgress = updatedGroup.memberProgress?.[memberId];

    if (!memberProgress) return;

    // Track completed tasks in a local variable since it's not in the interface
    const completedTaskIds = new Set<string>([]);

    if (completed) {
      completedTaskIds.add(taskId);
    } else {
      completedTaskIds.delete(taskId);
    }

    updatedGroup.memberProgress = {
      ...(updatedGroup.memberProgress || {}),
      [memberId]: {
        ...memberProgress,
        completedTasks: completed
          ? memberProgress.completedTasks + 1
          : Math.max(0, memberProgress.completedTasks - 1),
        lastActive: new Date(),
      },
    };

    const updatedGroups = studyGroups.map((g) =>
      g.id === selectedGroup.id ? updatedGroup : g
    );

    setStudyGroups(updatedGroups);
    setSelectedGroup(updatedGroup);
  };

  // Check if a task is completed
  // Since we don't have completedTaskIds in the interface, we'll need to track this separately
  // This is a simplified implementation that doesn't actually track individual task IDs
  const getTaskCompletionStatus = (
    memberId: string,
    _taskId: string
  ): boolean => {
    if (!selectedGroup || !selectedGroup.memberProgress) return false;

    const memberProgress = selectedGroup.memberProgress[memberId];
    if (!memberProgress) return false;

    // For now, we'll just return false as we need to implement a proper tracking mechanism
    // In a real implementation, we would check if _taskId is in the completed tasks list
    return false;
  };

  // Handle file download
  const handleFileDownload = (file: GroupFile) => {
    const blob = new Blob([file.content], { type: file.type || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if user is admin of selected group
  const isAdmin =
    selectedGroup?.members?.some(
      (member) => member.id === user?.id && member.role === "admin"
    ) || false;

  // Render the appropriate view
  const renderView = () => {
    if (!selectedGroup) {
      return (
        <GroupList
          groups={studyGroups}
          onSelectGroup={setSelectedGroup}
          onCreateGroup={() => setIsCreateGroupModalOpen(true)}
        />
      );
    }

    switch (activeView) {
      case "create-plan":
        return (
          <CreateStudyPlan
            group={selectedGroup}
            onBack={() => setActiveView("group-detail")}
            onSave={handleFormSubmit}
            onGeneratePlan={() => setActiveView("generate-plan")}
          />
        );
      case "generate-plan":
        return (
          <GenerateStudyPlan
            group={selectedGroup}
            onBack={() => setActiveView("group-detail")}
            onPlanGenerated={handlePlanGenerated}
          />
        );
      case "group-detail":
      default:
        return (
          <GroupDetail
            group={selectedGroup}
            onCreateStudyPlan={() => setActiveView("create-plan")}
            onAddMember={() => setIsAddMemberModalOpen(true)}
            onUploadFile={() => setIsUploadFileModalOpen(true)}
            onFileDownload={handleFileDownload}
            onTaskComplete={handleTaskComplete}
            getTaskCompletionStatus={getTaskCompletionStatus}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderView()}

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        newGroupData={newGroupData}
        setNewGroupData={setNewGroupData}
        onCreateGroup={createGroup}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        newMemberEmail={newMemberEmail}
        setNewMemberEmail={setNewMemberEmail}
        onAddMember={addMember}
      />

      <UploadFileModal
        isOpen={isUploadFileModalOpen}
        onClose={() => setIsUploadFileModalOpen(false)}
        isUploading={isUploading}
        uploadError={uploadError}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

// Wrapper component that provides the StudyGroupContext
const SocialFeatures: React.FC<SocialFeaturesProps> = () => {
  return (
    <StudyGroupProvider>
      <SocialFeaturesContent />
    </StudyGroupProvider>
  );
};

export default SocialFeatures;
