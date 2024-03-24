<template>
  <div style="height: 100%">
    <el-table :data="billList" border style="width: 100%" v-loading="loading">
      <el-table-column
        prop="bill.course.course_name"
        label="课程名"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="bill.course.date" label="日期" align="center">
      </el-table-column>
      <el-table-column prop="bill.course.cost" label="费用" align="center">
      </el-table-column>
      <el-table-column prop="status_description" label="状态" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <checkout-form
            v-model="formData"
            :product="scope.row"
            @tokenReceived="handleTokenReceived"
          ></checkout-form>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination total="10" page.sync="1" limit.sync="2" /> -->
    <pagination
      v-show="billTotal > 0"
      :total="billTotal"
      :page.sync="billListQuery.page"
      :limit.sync="billListQuery.page_size"
      @pagination="getBillListVue"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getStudentBill } from "@/api/bill";
import CheckoutForm from "@/components/omiseDev.vue";
import { Payments } from "@/api/student";
export default {
  components: { Pagination, CheckoutForm },
  data() {
    return {
      billList: [],
      billTotal: 0,
      billListQuery: {
        page: 1,
        page_size: 10,
      },
      formData: {},
      retrievedFormData: {},
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.getBillListVue();
    this.loading = false;
  },
  methods: {
    async getBillListVue() {
      this.loading = true;
      try {
        const { data: list } = await getStudentBill({
          page: this.billListQuery.page,
          page_size: this.billListQuery.page_size,
        });
        this.billList = list.list;
        var meta = list.meta;
        this.billListQuery.page = meta.currentPage;
        this.billTotal = meta.total;
      } catch (e) {}
      this.loading = false;
    },
    getFormData() {
      this.retrievedFormData = this.formData;
      console.log(this.retrievedFormData);
    },
    async handleTokenReceived(token, amount, currency, id) {
      console.log("父组件获取到的数据:", token, amount, currency, id);
      try {
        this.loading = true;
        const { data: list } = await Payments({
          amount: amount,
          currency: currency,
          omiseToken: token,
          id: id,
        });
        this.$message({ message: "支付成功", type: "success" });
        this.getBillListVue();
      } catch (e) {
        this.getBillListVue();
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
</style>