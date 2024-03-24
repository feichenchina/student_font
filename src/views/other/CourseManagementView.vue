<template>
  <div style="height: 100%">
    <el-row style="text-align: right">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
        >新增</el-button
      >
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="course_name" label="课程名" align="center">
      </el-table-column>
      <el-table-column prop="date" label="日期" align="center">
      </el-table-column>
      <el-table-column prop="cost" label="费用" align="center">
      </el-table-column>
      <el-table-column prop="cost" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            round
            @click="handleViewStudent(scope.row.id)"
            >查看学生</el-button
          >
          <el-button
            size="small"
            type="primary"
            round
            @click="handleInitStudent(scope.row.id)"
            :disabled="scope.row.bill_id != ''"
            >设置学生</el-button
          >
          <el-button
            size="small"
            type="primary"
            round
            @click="handleAddStudent(scope.row.id)"
            >添加学生</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination total="10" page.sync="1" limit.sync="2" /> -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getCourseListVue"
    />
    <!-- 新增 -->

    <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="course"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="课程名" prop="name">
          <el-input v-model="course.course_name" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="course.date"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="费用(元)" prop="cost">
          <el-input v-model="course.cost" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="addCourseVue()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 查看学生 -->
    <el-dialog
      :destroy-on-close="true"
      title="已选修学生"
      :visible.sync="ViewStudentTableVisible"
    >
      <el-table
        ref="viewMultipleTable"
        :data="viewStudentList"
        tooltip-effect="dark"
        style="width: 100%"
        :row-key="rowKey"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column label="学生姓名" width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="viewStudentTotal > 0"
        :total="viewStudentTotal"
        :page.sync="viewStudentListQuery.page"
        :limit.sync="viewStudentListQuery.page_size"
        @pagination="getViewStudentListVue"
      />
    </el-dialog>

    <!-- 设置学生 -->
    <el-dialog
      :destroy-on-close="true"
      title="初始化学生"
      :visible.sync="StudentTableVisible"
    >
      <el-table
        ref="multipleTable"
        :data="studentList"
        tooltip-effect="dark"
        style="width: 100%"
        :row-key="rowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
        ></el-table-column>
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column label="学生姓名" width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="studentTotal > 0"
        :total="studentTotal"
        :page.sync="studentListQuery.page"
        :limit.sync="studentListQuery.page_size"
        @pagination="getStudentListVue"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="clearStudentCourse">取消</el-button>
        <el-button
          type="primary"
          :loading="studentCourseDialogLoading"
          @click="initStudentCourseVue()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增学生 -->
    <el-dialog
      :destroy-on-close="true"
      title="新增学生"
      :visible.sync="addStudentTableVisible"
    >
      <el-table
        ref="addMultipleTable"
        :data="addStudentList"
        tooltip-effect="dark"
        style="width: 100%"
        :row-key="rowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
        ></el-table-column>
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column label="学生姓名" width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="addStudentTotal > 0"
        :total="addStudentTotal"
        :page.sync="addStudentListQuery.page"
        :limit.sync="addStudentListQuery.page_size"
        @pagination="getAddStudentListVue"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAddStudentCourseVue">取消</el-button>
        <el-button
          type="primary"
          :loading="addCourseStudenLoading"
          @click="addStudentCourseVue()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getStudentList,
  getCoursestudentList,
  getNotCoursestudentList,
} from "@/api/student";
import {
  addCourse,
  CourseList,
  InitCoursestudent,
  AddCoursestudent,
} from "@/api/course";
export default {
  components: { Pagination },
  data() {
    return {
      addCourseStudenLoading: false,
      dialogFormVisible: false,
      ViewStudentTableVisible: false,
      viewStudentList: [],
      viewStudentTotal: 0,
      viewStudentListQuery: {
        page: 1,
        page_size: 5,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: "-id",
      },
      addCourseStudentId: 0,
      addStudentTableVisible: false,
      addStudentList: [],
      addStudentTotal: 0,
      addStudentListQuery: {
        page: 1,
        page_size: 5,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: "-id",
      },
      StudentTableVisible: false,
      dialogLoading: false,
      studentCourseDialogLoading: false,
      course: {},
      total: 0,
      selectedCourseId: 0,
      listQuery: {
        page: 1,
        page_size: 10,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: "-id",
      },
      studentListQuery: {
        page: 1,
        page_size: 5,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: "-id",
      },
      studentTotal: 0,
      studentList: [],
      tableData: [
        // {
        //   date: "2016-05-03",
        //   name: "数学",
        //   cost: "1000",
        //   student: "王小虎",
        // },
        // {
        //   date: "2016-05-03",
        //   name: "数学",
        //   cost: "1000",
        //   student: "王小虎",
        // },
        // {
        //   date: "2016-05-03",
        //   name: "数学",
        //   cost: "1000",
        //   student: "王小虎",
        // },
        // {
        //   date: "2016-05-03",
        //   name: "数学",
        //   cost: "1000",
        //   student: "王小虎",
        // },
        // {
        //   date: "2016-05-03",
        //   name: "数学",
        //   cost: "1000",
        //   student: "王小虎",
        // },
      ],
      selectedStudentIds: [],
    };
  },
  created() {
    this.getCourseListVue();
  },
  methods: {
    rowKey(row) {
      return row.id;
    },
    // 处理学生选中事件
    handleSelectionChange(selection) {
      this.selectedStudentIds = selection.map((item) => item.id);
    },
    // 处理新增按钮
    handleAdd() {
      this.dialogFormVisible = true;
    },
    async addCourseVue() {
      this.dialogLoading = true;
      try {
        await addCourse(this.course);
        this.$message({ message: "成功", type: "success" });
        this.course = {};
        this.dialogLoading = false;
        await this.getCourseListVue();
        this.dialogFormVisible = false;
      } catch (e) {
        this.course = {};
        this.dialogLoading = false;
        this.dialogFormVisible = false;
      }
    },
    // 初始选修课程的学生
    async handleInitStudent(id) {
      try {
        this.selectedCourseId = id;
        this.StudentTableVisible = true;
        await this.getStudentListVue();
      } catch (e) {
        this.StudentTableVisible = false;
      }
    },

    // 新增选修课程的学生
    async handleAddStudent(id) {
      try {
        this.addCourseStudentId = id;
        this.addStudentTableVisible = true;
        await this.getAddStudentListVue();
      } catch (e) {
        this.addStudentListQuery.page = 1;
        this.addStudentTotal = 0;
        this.addStudentList = [];
        this.addStudentTableVisible = false;
      }
    },
    async getAddStudentListVue() {
      try {
        const { data: list } = await getNotCoursestudentList({
          page: this.addStudentListQuery.page,
          page_size: this.addStudentListQuery.page_size,
          course_id: this.addCourseStudentId,
        });
        this.addStudentList = list.list;
        this.addStudentTotal = list.meta.total;
        this.addStudentListQuery.page = list.meta.currentPage;
      } catch (e) {
        this.addStudentListQuery.page = 1;
        this.addStudentTotal = 0;
        this.addStudentList = [];
        this.addStudentTableVisible = false;
      }
    },

    async getCourseListVue() {
      try {
        const { data: list } = await CourseList({
          page: this.listQuery.page,
          page_size: this.listQuery.page_size,
        });
        this.tableData = list.list;
        var meta = list.meta;
        this.listQuery.page = meta.currentPage;
        this.total = meta.total;
        console.log("测试数据:", this.tableData.list);
      } catch (e) {}
    },
    // 获取已经选修该课的学生
    async getViewStudentListVue() {
      try {
        const { data: list } = await getCoursestudentList({
          page: this.viewStudentListQuery.page,
          page_size: this.viewStudentListQuery.page_size,
          course_id: this.selectedCourseId,
        });
        this.viewStudentList = list.list;
        this.viewStudentTotal = list.meta.total;
        this.viewStudentListQuery.page = list.meta.currentPage;
      } catch (e) {
        this.viewStudentListQuery.page = 1;
        this.viewStudentTotal = 0;
        this.viewStudentList = [];
        this.ViewStudentTableVisible = false;
      }
    },
    // 获取所有学生列表
    async getStudentListVue() {
      try {
        const { data: list } = await getStudentList({
          page: this.studentListQuery.page,
          page_size: this.studentListQuery.page_size,
          course_id: this.selectedCourseId,
        });
        this.studentList = list.list;
        var studentMeta = list.meta;
        this.studentTotal = studentMeta.total;
        this.studentListQuery.page = studentMeta.currentPage;
        this.studentList.forEach((item) => {
          if (item.selected == true) {
            this.$refs.multipleTable.toggleRowSelection(item);
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false);
          }
        });
      } catch (e) {}
    },
    // 查看已经选修这门课的学生
    async handleViewStudent(id) {
      this.selectedCourseId = id;
      await this.getViewStudentListVue();
      this.ViewStudentTableVisible = true;
    },
    // 对课程初始化学生
    async initStudentCourseVue() {
      this.studentCourseDialogLoading = true;
      const selectedIdstr = this.selectedStudentIds.join(",");
      console.log(this.selectedId, selectedIdstr);
      try {
        await InitCoursestudent({
          course_id: this.selectedCourseId,
          student_ids: selectedIdstr,
        });
        this.clearStudentCourse();
      } catch (e) {
        this.clearStudentCourse();
      }
    },
    async clearStudentCourse() {
      this.StudentTableVisible = false;
      this.studentCourseDialogLoading = false;
      this.studentList = [];
      this.$refs.multipleTable.clearSelection();
      this.studentListQuery.page = 1;
    },
    // 对课程新增学生-确定按钮
    async addStudentCourseVue() {
      this.addCourseStudenLoading = true;
      const selectedIdstr = this.selectedStudentIds.join(",");
      console.log(this.selectedId, selectedIdstr);
      try {
        await AddCoursestudent({
          course_id: this.addCourseStudentId,
          student_ids: selectedIdstr,
        });
        this.clearAddStudentCourseVue();
      } catch (e) {
        this.clearAddStudentCourseVue();
      }
    },
    async clearAddStudentCourseVue() {
      this.addStudentTableVisible = false;
      this.addCourseStudenLoading = false;
      this.addStudentList = [];
      this.$refs.addMultipleTable.clearSelection();
      this.addStudentListQuery.page = 1;
    },
  },
};
</script>
<style lang="scss" scope>
element.style {
  width: 100%;
  height: 100%;
}
</style>