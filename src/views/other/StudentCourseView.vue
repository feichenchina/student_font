<template>
  <div style="height: 100%">
    <el-table :data="courseList" border style="width: 100%">
      <el-table-column prop="course.course_name" label="课程名" align="center">
      </el-table-column>
      <el-table-column prop="course.date" label="日期" align="center">
      </el-table-column>
      <el-table-column prop="course.cost" label="费用" align="center">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination total="10" page.sync="1" limit.sync="2" /> -->
    <pagination
      v-show="courseTotal > 0"
      :total="courseTotal"
      :page.sync="courseListQuery.page"
      :limit.sync="courseListQuery.page_size"
      @pagination="getCourseListVue"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getCourseList } from "@/api/student";
export default {
  components: { Pagination },
  data() {
    return {
      courseList: [],
      courseTotal: 0,
      courseListQuery: {
        page: 1,
        page_size: 10,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: "-id",
      },
    };
  },
  created() {
    this.getCourseListVue();
  },
  methods: {
    async getCourseListVue() {
      try {
        const { data: list } = await getCourseList({
          page: this.courseListQuery.page,
          page_size: this.courseListQuery.page_size,
        });
        this.courseList = list.list;
        var meta = list.meta;
        this.courseListQuery.page = meta.currentPage;
        this.courseTotal = meta.total;
      } catch (e) {}
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