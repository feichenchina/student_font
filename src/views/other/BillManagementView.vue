<template>
  <div style="height: 100%">
    <el-row style="text-align: right">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddBill"
        >新增</el-button
      >
    </el-row>
    <!-- 内容列表 -->
    <el-table :data="billTableData" border style="width: 100%">
      <el-table-column
        prop="course.course_name"
        label="课程名"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="course.date"
        label="日期"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="course.cost" label="费用" align="center">
      </el-table-column>
      <el-table-column prop="status_description" label="状态" align="center">
      </el-table-column>
      <el-table-column prop="cost" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            round
            @click="sendStudentBill(scope.row.id)"
            >发送账单</el-button
          >

          <el-button
            size="small"
            type="primary"
            round
            @click="viewStudentBill(scope.row)"
            >查看账单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="billTotal > 0"
      :total="billTotal"
      :page.sync="billListQuery.page"
      :limit.sync="billListQuery.page_size"
      @pagination="getBillList"
    />

    <!-- 新增账单 -->
    <el-dialog title="新增账单" :visible.sync="addBillVisible">
      <div>
        <el-table :data="courseTableData" border style="width: 100%">
          <el-table-column
            prop="course_name"
            label="课程名"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="date" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="费用" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                round
                @click="createBill(scope.row.id)"
                >创建账单</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="courseTotal > 0"
          :total="courseTotal"
          :page.sync="courseListQuery.page"
          :limit.sync="courseListQuery.page_size"
          @pagination="getNotBillCourseList"
        />
      </div>
    </el-dialog>

    <!-- 查看账单 -->
    <el-dialog :before-close="beforeCloseFuction" title="查看账单支付情况" :visible.sync="viewBillStatusVisible" >
      <div>
        <el-table :data="viewBillStatusTableData" border style="width: 100%">
          <el-table-column
            prop="student.name"
            label="学生"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="课程名"
            width="180"
            align="center"
          >
          <template>{{ viewCorseName }}</template></el-table-column
          >
          </el-table-column>
          
          <el-table-column label="费用" align="center"
            ><template>{{ viewCorseCost }}</template></el-table-column
          >
          <el-table-column
            prop="status_description"
            label="支付状态"
            align="center"
          >
          <template slot-scope="scope">
        <span :style="{ color: scope.row.status_description === '已支付' ? 'green' : 'red' }">{{ scope.row.status_description }}</span>
      </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="viewBillStatusTotal > 0"
          :total="viewBillStatusTotal"
          :page.sync="viewBillStatusListQuery.page"
          :limit.sync="viewBillStatusListQuery.page_size"
          @pagination="getStudentBillStatus"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { NotBillCourseList } from "@/api/course";
import {
  addBill,
  listBill,
  sendBill,
  getStudentBillStatusList,
} from "@/api/bill";
export default {
  components: { Pagination },
  data() {
    return {
      addBillVisible: false,
      courseTableData: [],
      courseTotal: 0,
      courseListQuery: {
        page: 1,
        page_size: 5,
      },
      billTableData: [],
      billTotal: 0,
      billListQuery: {
        page: 1,
        page_size: 10,
      },

      viewBillStatusVisible: false,
      viewBillStatusTableData: [],
      viewBillStatusTotal: 0,
      viewBillStatusListQuery: {
        page: 1,
        page_size: 5,
      },
      viewBillId: 0,
      viewBillLoading: false,
      viewCorseName: "",
      viewCorseCost: 0,
    };
  },
  created() {
    this.getBillList();
  },
  methods: {
    // 获取账单列表
    async getBillList() {
      try {
        const { data: list } = await listBill({
          page: this.billListQuery.page,
          page_size: this.billListQuery.page_size,
        });
        this.billTableData = list.list;
        this.billTotal = list.meta.total;
        this.billListQuery.page = list.meta.currentPage;
        this.$message({ message: "成功", type: "success" });
      } catch (e) {
        this.$message({ message: e, type: "error" });
      }
    },
    // 处理新增按钮
    handleAddBill() {
      this.getNotBillCourseList();
      this.addBillVisible = true;
    },
    // 销毁新增的选择内容
    destoryAddCotent() {
      this.getBillList();
      this.courseListQuery.page = 1;
      this.courseTotal = 0;
      this.courseTableData = [];
      this.addBillVisible = false;
    },

    // 查看账单列表关闭前执行
    beforeCloseFuction() {
      this.viewBillStatusVisible = false;
      this.viewBillStatusTableData = [];
      this.viewBillStatusTotal = 0;
      (this.viewBillStatusListQuery = {
        page: 1,
        page_size: 5,
      }),
        (this.viewBillId = 0);
      this.viewCorseName = "";
      this.viewCorseCost = 0;
    },

    // 获取未创建账单的课程列表
    async getNotBillCourseList() {
      try {
        const { data: list } = await NotBillCourseList({
          page: this.courseListQuery.page,
          page_size: this.courseListQuery.page_size,
        });
        this.courseTableData = list.list;
        this.courseTotal = list.meta.total;
        this.courseListQuery.page = list.meta.currentPage;
        this.$message({ message: "成功", type: "success" });
      } catch (e) {
        this.$message({ message: e, type: "error" });
      }
    },
    // 创建账单
    async createBill(id) {
      try {
        const { data: list } = await addBill({
          course_id: id,
        });
        this.destoryAddCotent();
      } catch (e) {
        this.destoryAddCotent();
      }
    },

    // 发送账单
    async sendStudentBill(bill_id) {
      try {
        await sendBill({ bill_id: bill_id });
        await this.getBillList();
      } catch (e) {
        this.destoryAddCotent();
      }
    },

    // 获取账单学生支付情况列表
    async getStudentBillStatus() {
      try {
        this.viewBillLoading = true;
        const { data: list } = await getStudentBillStatusList({
          page: this.viewBillStatusListQuery.page,
          page_size: this.viewBillStatusListQuery.page_size,
          bill_id: this.viewBillId,
        });
        this.viewBillStatusTableData = list.list;
        this.viewBillStatusTotal = list.meta.total;
        this.viewBillStatusListQuery.page = list.meta.currentPage;
        this.viewBillLoading = false;
        this.$message({ message: "成功", type: "success" });
      } catch (e) {
        this.viewBillLoading = false;
        this.$message({ message: e, type: "error" });
      }
    },

    // 查看账单
    async viewStudentBill(row) {
      try {
        this.viewBillStatusVisible = true;
        this.viewBillLoading = true;
        this.viewBillId = row.id;
        this.viewCorseName = row.course.course_name;
        this.viewCorseCost = row.course.cost;
        await this.getStudentBillStatus();
        this.viewBillLoading = false;
      } catch (e) {
        this.viewBillLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scope>
element.style {
  width: 100%;
  height: 100%;
}
.filter-item {
  border-radius: 18px;
}
</style>