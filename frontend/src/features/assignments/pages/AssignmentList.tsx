
import { useMemo, useState } from "react";
import {
  useTable,
  CreateButton,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import {
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

const { Text } = Typography;

interface Assignment {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
}

export default function AssignmentList() {
  const [search, setSearch] = useState("");

  const { tableProps } = useTable<Assignment>({
    resource: "assignments",
    pagination: {
      mode: "client",
      pageSize: 10,
    },
    sorters: {
      mode: "off",
    },
    filters: {
      mode: "off",
    },
  });

  const assignments = (tableProps.dataSource ?? []) as Assignment[];

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return assignments;

    return assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(query) ||
        (assignment.description ?? "").toLowerCase().includes(query),
    );
  }, [assignments, search]);

  const now = Date.now();

  const upcomingCount = assignments.filter(
    (assignment) =>
      assignment.due_date &&
      new Date(assignment.due_date).getTime() >= now,
  ).length;

  const overdueCount = assignments.filter(
    (assignment) =>
      assignment.due_date &&
      new Date(assignment.due_date).getTime() < now,
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Text className="text-sm font-medium uppercase tracking-widest text-blue-600">
            Teacher workspace
          </Text>

          <h1 className="!mb-1 !mt-2 text-2xl font-bold tracking-wide text-slate-900 sm:text-3xl font-serif">
            Assignments
          </h1>

          <p className="m-0 text-sm text-slate-500 sm:text-base">
            Create, organize, and manage classroom assignments.
          </p>
        </div>

        <CreateButton resource="assignments" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="!rounded-2xl !border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                Total assignments
              </p>
              <p className="m-0 text-3xl font-bold text-slate-900">
                {assignments.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              <span aria-hidden="true">▤</span>
            </div>
          </div>
        </Card>

        <Card className="!rounded-2xl !border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                Upcoming deadlines
              </p>
              <p className="m-0 text-3xl font-bold text-slate-900">
                {upcomingCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
              <span aria-hidden="true">◷</span>
            </div>
          </div>
        </Card>

        <Card className="!rounded-2xl !border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                Past deadlines
              </p>
              <p className="m-0 text-3xl font-bold text-slate-900">
                {overdueCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-xl text-rose-600">
              <span aria-hidden="true">!</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments table */}
      <Card
        className="!rounded-2xl !border-slate-200 shadow-sm"
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="m-0 text-lg font-semibold text-slate-900 font-serif">
              All assignments
            </h2>
            <p className="mb-0 mt-1 text-sm text-slate-500">
              {filteredAssignments.length}{" "}
              {filteredAssignments.length === 1
                ? "assignment"
                : "assignments"}{" "}
              shown
            </p>
          </div>

          <Input.Search
            allowClear
            placeholder="Search assignments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="!w-full sm:!max-w-xs"
          />
        </div>

        <Table<Assignment>
          {...tableProps}
          dataSource={filteredAssignments}
          rowKey="id"
          scroll={{ x: 850 }}
          className="[&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-wide [&_.ant-table-thead>tr>th]:!text-slate-500"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showTotal: (total) => `${total} assignments`,
          }}
        >
          <Table.Column<Assignment>
            title="ID"
            dataIndex="id"
            width={75}
            sorter={(a, b) => a.id - b.id}
            render={(id: number) => (
              <Text className="text-slate-400">#{id}</Text>
            )}
          />

          <Table.Column<Assignment>
            title="Assignment"
            dataIndex="title"
            sorter={(a, b) => a.title.localeCompare(b.title)}
            render={(title: string, record) => (
              <div className="min-w-40">
                <p className="mb-1 font-semibold text-slate-800">
                  {title}
                </p>
                <Text type="secondary" className="text-xs">
                  {record.description || "No description provided"}
                </Text>
              </div>
            )}
          />

          <Table.Column<Assignment>
            title="Due date"
            dataIndex="due_date"
            sorter={(a, b) => {
              if (!a.due_date) return b.due_date ? 1 : 0;
              if (!b.due_date) return -1;

              return (
                new Date(a.due_date).getTime() -
                new Date(b.due_date).getTime()
              );
            }}
            filters={[
              { text: "Has deadline", value: "scheduled" },
              { text: "No deadline", value: "none" },
            ]}
            onFilter={(value, record) =>
              value === "scheduled"
                ? Boolean(record.due_date)
                : !record.due_date
            }
            render={(value: string | null) => {
              if (!value) {
                return <Tag>No deadline</Tag>;
              }

              const isOverdue = new Date(value).getTime() < Date.now();

              return (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm text-slate-700">
                    {new Date(value).toLocaleDateString()}
                  </span>
                  <Tag color={isOverdue ? "error" : "success"}>
                    {isOverdue ? "Past deadline" : "Upcoming"}
                  </Tag>
                </div>
              );
            }}
          />

          <Table.Column<Assignment>
            title="Created"
            dataIndex="created_at"
            sorter={(a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            }
            render={(value: string) =>
              new Date(value).toLocaleDateString()
            }
          />

          <Table.Column<Assignment>
            title="Actions"
            key="actions"
            fixed="right"
            width={115}
            render={(_, record) => (
              <Space size="small">
                <EditButton
                  hideText
                  size="small"
                  resource="assignments"
                  recordItemId={record.id}
                />
                <DeleteButton
                  hideText
                  size="small"
                  resource="assignments"
                  recordItemId={record.id}
                />
              </Space>
            )}
          />
        </Table>
      </Card>
    </div>
  );
}
